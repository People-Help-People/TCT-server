import fetch from "node-fetch";

const mynft = async (req, res) => {
  const { address } = req.query;
  if (!address) return res.status(400).send({ error: "Address is required" });
  const chains = ["1", "42", "137", "80001", "43114", "43113"];
  try {
    const nftBalances = await Promise.all(
      chains.map(async (chain) => {
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
              name: nft.contract_name,
              symbol: nft.contract_ticker_symbol,
              synced_at: nft.last_transferred_at,
              metadata: nft.nft_data,
            };
          });
        return {
          chain: chain,
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
