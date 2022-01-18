import express from "express";
import fetch from "node-fetch";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/nft/verify', async (req, res) => {
    const nft = req.query.nft;
    const owner = req.query.owner;
    const chain = req.query.chain;
    let nftOwner;

    // make RPC call to chain to verify nft
    const nftResult = await fetch(`https://deep-index.moralis.io/api/v2/nft/${nft}/owners?chain=${chain}&format=hex`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-API-KEY': process.env.MORALIS_API_KEY
        }
    });
    const nftResultJson = await nftResult.json();

    if (nftResultJson.total === 1) {
        nftOwner = nftResultJson.result[0].owner_of;
    }

    if (nftOwner.toUpperCase() === owner.toUpperCase()) {
        res.json({
            success: true,
        });
    } else {
        res.send({
            success: false,
        });
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
