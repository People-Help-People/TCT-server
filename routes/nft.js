import balance from "../controllers/nft/balance.js";
import verify from "../controllers/nft/verify.js";
import metaData from "../controllers/nft/metadata.js";

import express from "express";

const router = express.Router();

router.get("/verify", verify);
router.get("/balance", balance);
router.get("/metadata", metaData);

export default router;
