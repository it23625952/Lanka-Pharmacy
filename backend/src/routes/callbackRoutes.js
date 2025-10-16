import express from "express";
import { 
  createCallbackRequest, 
  getCallbackRequests, 
  getCallbackRequestById, 
  updateCallbackRequest, 
  deleteCallbackRequest,
  getCustomerCallbacks
} from "../controllers/callbackController.js";

const router = express.Router();

router.post("/", createCallbackRequest);
router.get("/", getCallbackRequests);
router.get("/customer/:userId", getCustomerCallbacks);
router.get("/:id", getCallbackRequestById);
router.put("/:id", updateCallbackRequest);
router.delete("/:id", deleteCallbackRequest);

export default router;
