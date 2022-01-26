import fetch from "node-fetch";

const mynft = async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).send({ error: "Address is required" });
  const chains = {
    mainnet: "1",

    kovan: "42",

    polygon: "137",

    mumbai: "80001",
  };

  try {
    const nftBalancesMor = await Promise.all(
      Object.keys(chains).map(async (chain) => {
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
              block_number: nft.block_number,
              name: nft.name,
              symbol: nft.symbol,
              token_uri: nft.token_uri,
              synced_at: nft.synced_at,
              metadata: nft.metadata,
            };
          });
        return {
          chain: chains[chain],
          balance: validNFTs,
        };
      })
    );
    const nftBalances = await Promise.all(
      Object.values(chains).map(async (chain) => {
        const nftData = await fetch(
          `${process.env.COVALENTHQ_BASE_URL}/${Number(
            chain
          )}/address/${address}/balances_v2/?key=${
            process.env.COVALENTHQ_API_KEY
          }&nft=true`
        );
        const jsonData = await nftData.json();
        const validNft = jsonData.data.items
          .filter((nft) => nft.nft_data)
          .map((nft) => {
            return {
              token_address: nft.contract_address,
              block_number: nftBalancesMor
                .find((nftMor) => nftMor.chain === chain)
                .balance.find(
                  (currentToken) =>
                    currentToken.token_address === nft.contract_address
                ).block_number,
              name: nft.contract_name,
              symbol: nft.contract_ticker_symbol,
              synced_at: nft.last_transferred_at,
              metadata: nft.nft_data,
            };
          });
        return {
          chain: Object.keys(chains).find((key) => chains[key] === chain),
          balance: validNft,
        };
      })
    );

    return res.send(nftBalances);
  } catch (error) {
    res.send(error);
  }
};

export default mynft;
