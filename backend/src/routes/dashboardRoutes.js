import express from "express";
import { 
  getDashboardStats, 
  getRecentActivity, 
  getPerformanceMetrics 
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/stats", getDashboardStats);
router.get("/activity", getRecentActivity);
router.get("/performance", getPerformanceMetrics);

export default router;
