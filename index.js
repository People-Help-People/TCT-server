import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/nft/verify', async (req, res) => {
    const nft = req.query.nft;
    const token_id = req.query.token_id;
    const owner = req.query.owner;
    const chain = req.query.chain;
    let nftOwner = "";

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
        nftToken = nftResultJson.result[0].token_id;
    }

    if (nftOwner.toUpperCase() === owner.toUpperCase() && nftToken === token_id) {
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.get('/nft/balance', async (req, res) => {
    const address = req.query.address;
    const chains = ["mainnet", "rinkeby", "ropsten", "kovan", "polygon", "mumbai"];

    const nftBalances = await Promise.all(chains.map(async (chain) => {
        // make RPC call to chain to get balance of address
        const balanceResult = await fetch(`https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=hex`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-KEY': process.env.MORALIS_API_KEY
            }
        });
        const balanceResultJson = await balanceResult.json();
        const validNFTs = balanceResultJson.result
            // .filter(nft => nft.is_valid)
            .map(nft => {
            return {
                token_address: nft.token_address,
                token_id: nft.token_id,
                block_number: nft.block_number,
                name: nft.name,
                symbol: nft.symbol,
                token_uri: nft.token_uri,
                synced_at: nft.synced_at,
                metadata: nft.metadata,
            }
         });
        
        return {
            chain: chain,
            balance: validNFTs
        };
    }));
    res.json(nftBalances);
});

app.get('/twitter/verify', async (req, res) => {
    const tweet = req.query.tweet;
    const randid = req.query.randid;
    let twitterOwner = "";

    //get tweet owner
    const tweetResult = await fetch(`https://api.twitter.com/2/tweets?ids=${tweet}&expansions=author_id&user.fields=username`, {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.TWITTER_API_KEY}`
        }
    });
    const tweetResultJson = await tweetResult.json();
    const tweetText = tweetResultJson.data[0].text;
    const tweetRandID = tweetText.substr(25, 20);
    const tweetAuthor = tweetResultJson.includes.users[0].username;

    if (tweetRandID.toUpperCase() === randid.toUpperCase()) {
        res.json({
            username: tweetAuthor,
        });
    } else {
        res.json({
            username: "RickAstley",
        });
    }
})

//Server Setup
if (process.env.PORT) {
    app.listen(process.env.PORT, process.env.IP, () => {
        console.log('Server is running on port ' + process.env.PORT);
    });
} else {
    app.listen(4000, () => {
        console.log('Server is running on port 4000');
    });
}