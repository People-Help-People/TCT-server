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
    let nftBalances = [];
    await Promise.all(
      Object.keys(chains).map(async (chain) => {
        const chainId = chains[chain];
        const nftData = await fetch(
          `${process.env.COVALENTHQ_BASE_URL}/${Number(
            chainId
          )}/address/${address}/balances_v2/?key=${process.env.COVALENTHQ_API_KEY
          }&nft=true`
        );
        const jsonData = await nftData.json();
        console.log(jsonData);
        if (jsonData.error) return;
        const validNfts = jsonData.data.items
          .filter((nft) => nft.type === "nft")
          .forEach((nft) => {
            nft.nft_data.map(nft_token => {
              nftBalances.push({
                chain: chain,
                token_address: nft.contract_address,
                token_id: nft_token.token_id,
                block_number: 0,
                name: nft.contract_name,
                symbol: nft.contract_ticker_symbol,
                metadata: nft_token.external_data,
              });
            });
          });
      })
    );

    return res.send(nftBalances);
  } catch (error) {
    res.send(error);
  }
};

export default mynft;
