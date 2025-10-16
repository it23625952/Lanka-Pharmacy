import express from "express";
import { submitFeedback, getFeedbacks, getFeedbackById, deleteFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", getFeedbacks);
router.get("/:id", getFeedbackById);
router.delete("/:id", deleteFeedback);

export default router;
