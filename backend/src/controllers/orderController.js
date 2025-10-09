import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import Product from '../models/Product.js';

// Create order from verified prescription
export const createOrderFromPrescription = async (req, res) => {
    try {
        const { prescriptionId, paymentMethod, shippingAddress, notes } = req.body;
        const customerId = req.user.userId;

        // Find the verified prescription
        const prescription = await Prescription.findById(prescriptionId)
            .populate('products.productId')
            .populate('customer');

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        if (prescription.status !== 'Verified') {
            return res.status(400).json({ message: 'Only verified prescriptions can be converted to orders' });
        }

        if (prescription.customer._id.toString() !== customerId) {
            return res.status(403).json({ message: 'You can only create orders from your own prescriptions' });
        }

        // Prepare order items
        const items = prescription.products.map(item => ({
            product: item.productId._id,
            quantity: item.quantity,
            price: item.productId.retailPrice,
            dosage: item.dosage || ''
        }));

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

        // Create order
        const order = new Order({
            customer: customerId,
            prescription: prescriptionId,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            shippingAddress: shippingAddress || '',
            notes: notes || ''
        });

        await order.save();
        await order.populate('customer', 'name email phone');
        await order.populate('prescription');
        await order.populate('items.product', 'name imageUrl');

        res.status(201).json({
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
};

// Get all orders (for staff)
export const getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = status && status !== 'all' ? { status } : {};

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .populate('prescription')
            .populate('items.product', 'name imageUrl')
            .populate('cancelledBy', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error getting orders:', error);
        res.status(500).json({ message: 'Server error while getting orders' });
    }
};

// Get customer's orders
export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user.userId;
        const { status, page = 1, limit = 10 } = req.query;
        
        const filter = { customer: customerId };
        if (status && status !== 'all') {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .populate('prescription')
            .populate('items.product', 'name imageUrl retailPrice')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(filter);

        res.json({
            orders,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (error) {
        console.error('Error getting customer orders:', error);
        res.status(500).json({ message: 'Server error while getting orders' });
    }
};

// Get single order
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone address')
            .populate('prescription')
            .populate('items.product', 'name imageUrl retailPrice wholesalePrice description')
            .populate('cancelledBy', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user has permission to view this order
        if (req.user.role === 'Retail Customer' || req.user.role === 'Wholesale Customer') {
            if (order.customer._id.toString() !== req.user.userId) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        res.json(order);
    } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ message: 'Server error while getting order' });
    }
};

// Update order status (staff only)
export const updateOrderStatus = async (req, res) => {
    try {
        const { status, estimatedReadyTime, notes } = req.body;
        
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order
        order.status = status;
        if (estimatedReadyTime) order.estimatedReadyTime = estimatedReadyTime;
        if (notes) order.notes = notes;

        // Set picked up time if status is completed
        if (status === 'Completed' && !order.pickedUpAt) {
            order.pickedUpAt = new Date();
        }

        // Set cancelled time if status is cancelled
        if (status === 'Cancelled' && !order.cancelledAt) {
            order.cancelledAt = new Date();
            order.cancelledBy = req.user.userId;
        }

        await order.save();
        await order.populate('customer', 'name email phone');
        await order.populate('items.product', 'name imageUrl');

        res.json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error while updating order' });
    }
};

// Cancel order
export const cancelOrder = async (req, res) => {
    try {
        const { cancellationReason } = req.body;
        const customerId = req.user.userId;

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns the order or is staff
        if (order.customer.toString() !== customerId && !['Owner', 'Manager', 'Staff'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if order can be cancelled
        if (['Completed', 'Cancelled', 'Ready for Pickup'].includes(order.status)) {
            return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
        }

        order.status = 'Cancelled';
        order.cancelledAt = new Date();
        order.cancelledBy = customerId;
        order.cancellationReason = cancellationReason || '';

        await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Server error while cancelling order' });
    }
};