import fetch from "node-fetch";

const metaData = async (req, res) => {
  const { chain, address, token_id } = req.query;
  if (!chain) return res.status(400).send({ error: "chain is required" });
  if (!address) return res.status(400).send({ error: "Address is required" });
  if (!token_id)
    return res.status(400).send({
      error: "Token ID missing",
    });
  try {
    const nftData = await fetch(
      `${process.env.COVALENTHQ_BASE_URL}/${Number(
        chain
      )}/tokens/${address}/nft_metadata/${token_id}/?key=${
        process.env.COVALENTHQ_API_KEY
      }`
    );
    const jsonData = await nftData.json();
    return res.send(jsonData);
  } catch (error) {
    res.send(error);
  }
};

export default metaData;
