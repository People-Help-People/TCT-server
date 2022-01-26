import express from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import nftRouter from "./routes/nft.js";

dotenv.config();


app.use("/nft", nftRouter);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.get("/twitter/verify", async (req, res) => {
  const tweet = req.query.tweet;
  const randid = req.query.randid;
  let twitterOwner = "";

  //get tweet owner
  const tweetResult = await fetch(
    `https://api.twitter.com/2/tweets?ids=${tweet}&expansions=author_id&user.fields=username`,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.TWITTER_API_KEY}`,
      },
    }
  );
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
});

app.use(cors());

//Server Setup
if (process.env.PORT) {
  app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running on port " + process.env.PORT);
  });
} else {
  app.listen(4000, () => {
    console.log("Server is running at: http://localhost:4000");
  });
}
