import Order from '../models/Order.js';
import Prescription from '../models/Prescription.js';
import Product from '../models/Product.js';

export const createOrderFromPrescription = async (req, res) => {
    try {
        console.log('=== CREATE ORDER FROM PRESCRIPTION ===');
        console.log('Request body:', req.body);
        console.log('User ID:', req.user.userId);
        
        const { prescriptionId, shippingAddress, paymentMethod, notes } = req.body;

        // Validate required fields
        if (!prescriptionId || !shippingAddress) {
            return res.status(400).json({ 
                message: "Prescription ID and shipping address are required" 
            });
        }

        // Find the prescription with populated data
        const prescription = await Prescription.findById(prescriptionId)
            .populate('customer', 'name email phone')
            .populate('products.productId', 'name retailPrice stockQuantity');

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        // Check if prescription is verified
        if (prescription.status !== 'Verified') {
            return res.status(400).json({ 
                message: "Prescription must be verified before creating an order" 
            });
        }

        // Check if order already exists for this prescription
        if (prescription.order) {
            return res.status(400).json({ 
                message: "Order already exists for this prescription" 
            });
        }

        // Validate product availability and prepare order items
        const orderItems = [];
        let totalAmount = 0;

        for (const item of prescription.products) {
            const product = item.productId;
            
            if (!product) {
                return res.status(400).json({ 
                    message: `Product not found for item: ${item.productId}` 
                });
            }

            // Check stock availability
            if (product.stockQuantity < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}, Requested: ${item.quantity}` 
                });
            }

            // Calculate item total and add to order
            const itemTotal = product.retailPrice * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.retailPrice,
                dosage: item.dosage || ''
            });

            // Update product stock
            product.stockQuantity -= item.quantity;
            await product.save();
        }

        // Create order data
        const orderData = {
            customer: prescription.customer._id,
            prescription: prescriptionId,
            items: orderItems,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod || 'Cash on Delivery',
            notes: notes || '',
            status: 'Pending',
            paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid'
        };

        console.log('Order data to create:', orderData);

        // Create the order
        const order = new Order(orderData);
        await order.save();

        // Update prescription with order reference
        prescription.order = order._id;
        await prescription.save();

        // Populate the order for response
        await order.populate('customer', 'name email phone');
        await order.populate('items.product', 'name retailPrice imageUrl');

        console.log('Order created successfully:', order._id);

        res.status(201).json({
            message: "Order created successfully from prescription",
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                status: order.status,
                totalAmount: order.totalAmount,
                customer: order.customer,
                items: order.items
            }
        });

    } catch (error) {
        console.error("Error creating order from prescription: ", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Full error stack:", error.stack);
        
        if (error.name === 'ValidationError') {
            console.error("Validation errors:", error.errors);
            return res.status(400).json({ 
                message: "Validation error", 
                errors: error.errors 
            });
        }
        
        res.status(500).json({ message: "Server error while creating order" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email phone')
            .populate('prescription')
            .populate('items.product', 'name retailPrice imageUrl')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error("Error getting orders: ", error);
        res.status(500).json({ message: "Server error while getting orders" });
    }
};

export const getCustomerOrders = async (req, res) => {
    try {
        const customerId = req.user.userId;
        
        const orders = await Order.find({ customer: customerId })
            .populate('customer', 'name email phone')
            .populate('prescription')
            .populate('items.product', 'name retailPrice imageUrl')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error("Error getting customer orders: ", error);
        res.status(500).json({ message: "Server error while getting orders" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('customer', 'name email phone')
            .populate('prescription')
            .populate('items.product', 'name retailPrice imageUrl');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ order });
    } catch (error) {
        console.error("Error getting order: ", error);
        res.status(500).json({ message: "Server error while getting order" });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid order status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('customer', 'name email phone')
         .populate('items.product', 'name retailPrice imageUrl');

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error updating order status: ", error);
        res.status(500).json({ message: "Server error while updating order status" });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const customerId = req.user.userId;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check if customer owns the order
        if (order.customer.toString() !== customerId) {
            return res.status(403).json({ message: "Access denied. You can only cancel your own orders." });
        }

        // Check if order can be cancelled
        if (['Completed', 'Cancelled'].includes(order.status)) {
            return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` });
        }

        order.status = 'Cancelled';
        order.cancelledAt = new Date();
        order.cancelledBy = customerId;
        order.cancellationReason = reason || '';

        await order.save();

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stockQuantity += item.quantity;
                await product.save();
            }
        }

        res.json({
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        console.error("Error cancelling order: ", error);
        res.status(500).json({ message: "Server error while cancelling order" });
    }
};