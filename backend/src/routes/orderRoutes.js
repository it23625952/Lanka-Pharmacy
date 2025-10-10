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
router.get('/:id', authenticate, getOrderById);
router.put('/:id/cancel', authenticate, cancelOrder);

// Staff routes - require authentication (additional authorization handled in controller)
router.get('/', authenticate, getAllOrders);
router.put('/:id/status', authenticate, updateOrderStatus);

export default router;