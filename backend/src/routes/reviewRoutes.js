import express from "express";
import { createReview, getProductReviews, getProductRatingSummary } from "../controllers/reviewController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.post("/", authenticate, createReview);
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/summary", getProductRatingSummary);

export default router;