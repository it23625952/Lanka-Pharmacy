import express from "express";
<<<<<<< HEAD
import { signUp, signIn, getUserProfile, updateUserProfile, deleteAccount, requestPasswordReset, resetPassword, changePassword } from "../controllers/userController.js";
=======
import { signUp, signIn, getUserProfile, updateUserProfile, deleteAccount, forgotPassword, resetPassword, changePassword } from "../controllers/userController.js";
>>>>>>> cart
import authenticate from "../middleware/authenticate.js"; // Import authentication middleware

const router = express.Router();

// Public routes (no authentication required)
<<<<<<< HEAD
router.post("/auth/signup", signUp); // User registration endpoint
router.post("/auth/signin", signIn); // User authentication endpoint

// Password management routes (no authentication required for recovery)
router.post('/forgot-password', requestPasswordReset); // Initiate password reset process
=======
router.post("/auth/signUp", signUp); // User registration endpoint
router.post("/auth/signIn", signIn); // User authentication endpoint

// Password management routes (no authentication required for recovery)
router.post('/forgot-password', forgotPassword); // Initiate password reset process
>>>>>>> cart
router.post('/reset-password/:token', resetPassword); // Complete password reset with token

// Protected routes (authentication required)
router.get("/profile", authenticate, getUserProfile); // Retrieve authenticated user's profile
router.put("/profile", authenticate, updateUserProfile); // Update authenticated user's profile
router.delete("/deleteAccount", authenticate, deleteAccount); // Delete authenticated user's account (requires password confirmation)
router.post('/change-password', authenticate, changePassword); // Change password while authenticated

export default router;