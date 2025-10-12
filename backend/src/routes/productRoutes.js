// routes/productRoutes.js
import express from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/productController.js";
import authenticate from "../middleware/authenticate.js"; // Import the middleware

const router = express.Router();

// Public routes - accessible without authentication
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get specific product by ID

// Protected routes - require authentication
router.post("/", authenticate, createProduct); // Create new product
router.put("/:id", authenticate, updateProduct); // Update existing product
router.delete("/:id", authenticate, deleteProduct); // Delete product

export default router;