import fetch from "node-fetch";

const balance = async (req, res) => {
  const address = req.query.address;
  const chains = [
    "mainnet",
    "rinkeby",
    "ropsten",
    "kovan",
    "polygon",
    "mumbai",
  ];

  const nftBalances = await Promise.all(
    chains.map(async (chain) => {
      // make RPC call to chain to get balance of address
      const balanceResult = await fetch(
        `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=hex`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-API-KEY": process.env.MORALIS_API_KEY,
          },
        }
      );
      const balanceResultJson = await balanceResult.json();
      const validNFTs = balanceResultJson.result
        // .filter(nft => nft.is_valid)
        .map((nft) => {
          return {
            token_address: nft.token_address,
            token_id: nft.token_id,
            block_number: nft.block_number,
            name: nft.name,
            symbol: nft.symbol,
            token_uri: nft.token_uri,
            synced_at: nft.synced_at,
            metadata: nft.metadata,
          };
        });

      return {
        chain: chain,
        balance: validNFTs,
      };
    })
  );
  res.json(nftBalances);
};

export default balance;
