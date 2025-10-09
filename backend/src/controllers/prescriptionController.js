import Prescription from "../models/Prescription.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

/**
 * Handles prescription image upload and creates a new prescription record.
 * Supports both authenticated users and guest users.
 * 
 * @param {Object} req - Request object containing prescription data and file
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with prescription details or error
 */
export const uploadPrescription = async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, notes } = req.body;
        const prescriptionImage = req.file ? req.file.path : null;
        
        let customerId = req.user?.userId; // Optional chaining for guest users

        // Validate that prescription image is provided
        if (!prescriptionImage) {
            return res.status(400).json({ message: "Prescription image is required" });
        }

        const prescriptionData = {
            prescriptionImage,
            notes: notes || ''
        };

        // If user is authenticated, use their ID
        if (customerId) {
            prescriptionData.customer = customerId;
        } else {
            // For guest users, store the provided contact details
            prescriptionData.customerName = customerName;
            prescriptionData.customerEmail = customerEmail;
            prescriptionData.customerPhone = customerPhone;
        }

        const prescription = new Prescription(prescriptionData);
        await prescription.save();

        // Populate customer details if authenticated user
        if (customerId) {
            await prescription.populate('customer', 'name email phone');
        }
        
        res.status(201).json({
            message: 'Prescription uploaded successfully',
            prescription: {
                id: prescription._id,
                status: prescription.status,
                // Return appropriate customer info based on user type
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
 * Retrieves all prescriptions with optional status filtering.
 * Used by administrators to view all prescription submissions.
 * 
 * @param {Object} req - Request object with optional status query parameter
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with prescriptions array or error
 */
export const getPrescriptions = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status ? { status } : {}; // Apply status filter if provided

        const prescriptions = await Prescription.find(filter)
            .populate('customer', 'name email phone') // Populate customer details
            .populate('verifiedBy', 'name email') // Populate staff who verified
            .populate('products.productId', 'name retailPrice imageUrl') // Populate product details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({ prescriptions });
    } catch (error) {
        console.error("Error getting prescriptions: ", error);
        res.status(500).json({ message: "Server error while getting prescriptions" });
    }
};

/**
 * Verifies a prescription by checking product availability and calculating total.
 * Updates prescription status and associates products with quantities.
 * 
 * @param {Object} req - Request object with prescription ID and product data
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with verification result or error
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

        // Validate each product and calculate total amount
        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(400).json({ message: `Product with ID ${item.productId} not found` });
            }

            // Check product stock availability
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` });
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
 * Rejects a prescription with a specified reason.
 * Updates prescription status and stores rejection details.
 * 
 * @param {Object} req - Request object with prescription ID and rejection reason
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with rejection confirmation or error
 */
export const rejectPrescription = async (req, res) => {
    try {
        const { prescriptionId } = req.params;
        const { reason } = req.body;

        const prescription = await Prescription.findById(prescriptionId);

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        // Update prescription with rejection details
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
 * Retrieves prescriptions for the authenticated customer.
 * Supports optional status filtering for customer's own prescriptions.
 * 
 * @param {Object} req - Request object with authenticated user and optional status filter
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with customer's prescriptions or error
 */
export const getCustomerPrescriptions = async (req, res) => {
    try {
        const customerId = req.user.userId; // Get user ID from authenticated user
        
        const { status } = req.query;
        const filter = { customer: customerId }; // Filter by customer ID
        
        // Apply status filter if provided and not 'all'
        if (status && status !== 'all') {
            filter.status = status;
        }

        const prescriptions = await Prescription.find(filter)
            .populate('customer', 'name email phone') // Populate customer details
            .populate('verifiedBy', 'name email') // Populate staff who processed
            .populate('products.productId', 'name retailPrice imageUrl') // Populate product details
            .sort({ createdAt: -1 }); // Sort by newest first

        res.json({ prescriptions });
    } catch (error) {
        console.error("Error getting customer prescriptions: ", error);
        res.status(500).json({ message: "Server error while getting prescriptions" });
    }
};