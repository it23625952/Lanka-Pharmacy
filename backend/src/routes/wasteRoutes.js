import express from "express";
import { getWasteAnalytics, markAsWasted } from "../controllers/wasteController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/analytics", authenticate, getWasteAnalytics);
router.post("/mark-wasted", authenticate, markAsWasted);

export default router;