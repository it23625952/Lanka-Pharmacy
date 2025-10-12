import Prescription from "../models/Prescription.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * Upload prescription image and create prescription record
 * Supports both authenticated users and guest users
 */
export const uploadPrescription = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, notes } = req.body;
        const prescriptionImage = req.file ? req.file.path : null;
        
        let customerId = req.user?.userId;

        // Validate prescription image
        if (!prescriptionImage) {
            return res.status(400).json({ message: "Prescription image is required" });
        }

        const prescriptionData = {
            prescriptionImage,
            notes: notes || ''
        };

        // Handle authenticated vs guest users
        if (customerId) {
            prescriptionData.customer = customerId;
        } else {
            prescriptionData.customerName = customerName;
            prescriptionData.customerEmail = customerEmail;
            prescriptionData.customerPhone = customerPhone;
        }

        const prescription = new Prescription(prescriptionData);
        await prescription.save();

        // Populate customer details for authenticated users
        if (customerId) {
            await prescription.populate('customer', 'name email phone');
        }
        
        res.status(201).json({
            message: 'Prescription uploaded successfully',
            prescription: {
                id: prescription._id,
                status: prescription.status,
                customer: customerId ? {
                    name: prescription.customer.name,
                    email: prescription.customer.email,
                    phone: prescription.customer.phone
                } : {
                    name: customerName,
                    email: customerEmail,
                    phone: customerPhone
                }
            }
        });
    } catch (error) {
        console.error("Error uploading prescription: ", error);
        res.status(500).json({ message: "Server error while uploading prescription" });
    }
};

/**
 * Get all prescriptions with optional status filtering
 * Used by administrators to manage prescription submissions
 */
export const getPrescriptions = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {};

        const prescriptions = await Prescription.find(filter)
            .populate('customer', 'name email phone')
            .populate('verifiedBy', 'name email')
            .populate('products.productId', 'name retailPrice imageUrl')
            .sort({ createdAt: -1 });

        res.json({ prescriptions });
    } catch (error) {
        console.error("Error getting prescriptions: ", error);
        res.status(500).json({ message: "Server error while getting prescriptions" });
    }
};

/**
 * Verify prescription by checking product availability and calculating total
 * Updates prescription status and associates products with quantities
 */
export const verifyPrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { products, notes } = req.body;

        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        let totalAmount = 0;

        // Validate products and calculate total
        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }

            totalAmount += product.retailPrice * item.quantity;
        }

        // Update prescription with verification details
        prescription.status = 'Verified';
        prescription.verifiedBy = req.user.userId;
        prescription.verifiedAt = new Date();
        prescription.products = products;
        prescription.totalAmount = totalAmount;
        prescription.notes = notes || '';

        await prescription.save();

        // Find customer for the verified prescription
        let user = await User.findOne({ email: prescription.customerEmail });

        if (!user) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json({
            message: "Prescription verified successfully",
            prescription,
            totalAmount
        });
    } catch (error) {
        console.error("Error verifying prescription: ", error);
        res.status(500).json({ message: "Server error while verifying prescription" });
    }
};

/**
 * Reject prescription with specified reason
 * Updates prescription status and stores rejection details
 */
export const rejectPrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { reason } = req.body;

        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        prescription.status = 'Rejected';
        prescription.verifiedBy = req.user.userId;
        prescription.verifiedAt = new Date();
        prescription.notes = reason || '';

        await prescription.save();

        res.json({ message: "Prescription rejected successfully" });
    } catch (error) {
        console.error("Error rejecting prescription: ", error);
        res.status(500).json({ message: "Server error while rejecting prescription" });
    }
};

/**
 * Get prescriptions for authenticated customer
 * Supports optional status filtering for customer's prescriptions
 */
export const getCustomerPrescriptions = async (req, res) => {
    try {
        const customerId = req.user.userId;
        const { status } = req.query;
        const filter = { customer: customerId };
        
        if (status && status !== 'all') {
            filter.status = status;
        }

        const prescriptions = await Prescription.find(filter)
            .populate('customer', 'name email phone')
            .populate('verifiedBy', 'name email')
            .populate('products.productId', 'name retailPrice imageUrl')
            .sort({ createdAt: -1 });

        res.json({ prescriptions });
    } catch (error) {
        console.error("Error getting customer prescriptions: ", error);
        res.status(500).json({ message: "Server error while getting prescriptions" });
    }
};

/**
 * Delete prescription (only if status is Pending)
 * Customers can only delete their own pending prescriptions
 */
export const deletePrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const customerId = req.user.userId;

        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        // Check prescription ownership
        if (prescription.customer.toString() !== customerId) {
            return res.status(403).json({ message: "Access denied. You can only delete your own prescriptions." });
        }

        // Only allow deletion of pending prescriptions
        if (prescription.status !== 'Pending') {
            return res.status(400).json({ 
                message: "Cannot delete prescription. Only pending prescriptions can be deleted." 
            });
        }

        await Prescription.findByIdAndDelete(prescriptionId);

        res.json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error("Error deleting prescription: ", error);
        res.status(500).json({ message: "Server error while deleting prescription" });
    }
};