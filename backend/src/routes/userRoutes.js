import express from "express";
import { signUp, signIn, getUserProfile, updateUserProfile, deleteAccount } from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js"; // Import authentication middleware

const router = express.Router();

// Public routes (no authentication required)
router.post("/auth/signUp", signUp); // User registration endpoint
router.post("/auth/signIn", signIn); // User authentication endpoint

// Protected routes (authentication required)
router.get("/profile", authenticate, getUserProfile); // Retrieve authenticated user's profile
router.put("/profile", authenticate, updateUserProfile); // Update authenticated user's profile
router.delete("/deleteAccount", authenticate, deleteAccount); // Delete authenticated user's account (requires password confirmation)

export default router;