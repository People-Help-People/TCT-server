import balance from "../controllers/nft/balance.js";
import verify from "../controllers/nft/verify.js";
import metaData from "../controllers/nft/metadata.js";

import express from "express";
import mynft from "../controllers/nft/mynft.js";

const router = express.Router();

router.get("/verify", verify);
router.get("/balance", balance);
router.get("/metadata", metaData);
router.get("/mynft", mynft);

export default router;
