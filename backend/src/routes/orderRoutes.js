import express from 'express';
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

// Staff routes - require authentication (additional authorization handled in controller)
router.get('/', authenticate, getAllOrders);

// IMPORTANT: Put specific routes BEFORE parameterized routes
router.get('/dashboard', authenticate, (req, res) => {
    // This will handle /api/orders/dashboard
    // You can either handle it here or create a separate controller
    res.json({ message: 'Order dashboard endpoint' });
});

// Parameterized routes - should come AFTER specific routes
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, updateOrderStatus);
router.put('/:id/cancel', authenticate, cancelOrder);

export default router;