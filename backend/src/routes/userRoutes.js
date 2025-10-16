import express from "express";
import {
  signUp,
  signIn,
  getUserProfile,
  updateUserProfile,
  deleteAccount,
  requestPasswordReset, // or use forgotPassword if that's your preferred naming
  resetPassword,
  changePassword
} from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/auth/signup", signUp); // User registration endpoint
router.post("/auth/signin", signIn); // User authentication endpoint

// Password management routes (no authentication required for recovery)
router.post("/forgot-password", requestPasswordReset); // Initiate password reset process
router.post("/reset-password/:token", resetPassword); // Complete password reset with token

// Protected routes (authentication required)
router.get("/profile", authenticate, getUserProfile); // Retrieve authenticated user's profile
router.put("/profile", authenticate, updateUserProfile); // Update authenticated user's profile
router.delete("/deleteAccount", authenticate, deleteAccount); // Delete authenticated user's account
router.post("/change-password", authenticate, changePassword); // Change password while authenticated

export default router;
