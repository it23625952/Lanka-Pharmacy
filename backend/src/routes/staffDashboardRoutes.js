import express from "express";
import { 
  getCustomerEngagement,
  getCustomerSatisfaction,
  getInteractionPatterns,
  getCallbackMetrics,
  getCustomerProfile
} from "../controllers/staffDashboardController.js";

const router = express.Router();

router.get("/engagement", getCustomerEngagement);
router.get("/satisfaction", getCustomerSatisfaction);
router.get("/interactions", getInteractionPatterns);
router.get("/callbacks", getCallbackMetrics);
router.get("/customer/:customerID", getCustomerProfile);

export default router;
