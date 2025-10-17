import express from 'express';
<<<<<<< HEAD
import { 
    createOrderFromPrescription, 
    getAllOrders, 
    getCustomerOrders, 
    getOrderById, 
    updateOrderStatus, 
    cancelOrder 
} from '../controllers/orderController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

// Customer routes - require authentication
router.post('/create-from-prescription', authenticate, createOrderFromPrescription);
router.get('/customer/my-orders', authenticate, getCustomerOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

// Staff routes - require authentication (additional authorization handled in controller)
router.get('/', authenticate, getAllOrders);
router.put('/:id/status', authenticate, updateOrderStatus);

export default router;
=======
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
>>>>>>> 20812727a0e85cc7b0aef4707d73931e91e077b2
