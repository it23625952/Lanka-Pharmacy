import express from "express";
import {
  addToCart,
  getCart,
  updateItem,
  removeItem,
  clearCart
} from "../controllers/cartController.js";

const router = express.Router();

// Add item to cart
router.post("/add", addToCart);

// Get cart items for a user
router.get("/:userId", getCart);

// Update quantity or item details
router.put("/update/:itemId", updateItem);

// Remove item from cart
router.delete("/remove/:itemId", removeItem);

// Clear entire cart for a user
router.delete("/clear/:userId", clearCart);

export default router;
