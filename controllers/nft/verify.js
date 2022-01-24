import fetch from "node-fetch";

const verify = async (req, res) => {
  const nft = req.query.nft;
  const owner = req.query.owner;
  const chain = req.query.chain;
  let nftOwner = "";

  // make RPC call to chain to verify nft
  const nftResult = await fetch(
    `https://deep-index.moralis.io/api/v2/nft/${nft}/owners?chain=${chain}&format=hex`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": process.env.MORALIS_API_KEY,
      },
    }
  );
  const nftResultJson = await nftResult.json();

  if (nftResultJson.total === 1) {
    nftOwner = nftResultJson.result[0].owner_of;
  }

  if (nftOwner.toUpperCase() === owner.toUpperCase()) {
    res.json({
      success: true,
    });
  } else {
    res.json({
      success: false,
    });
  }
};

export default verify;
