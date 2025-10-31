import express from 'express';
import {
  createOrder,
  getOrdersByUser,
  updateOrderStatus,
  deleteOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Create a new order
router.post('/create', createOrder);

// Get all orders for a user
router.get('/user/:userId', getOrdersByUser);

// Update order status
router.put('/update/:orderId', updateOrderStatus);

// Delete an order
router.delete('/delete/:orderId', deleteOrder);

export default router;
