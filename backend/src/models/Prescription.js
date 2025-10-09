import mongoose from 'mongoose';

/**
 * Mongoose schema definition for Prescription entities.
 * Manages prescription uploads, verification, and associated medication orders.
 * Tracks customer prescriptions through the verification workflow.
 */
const prescriptionSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        prescriptionImage: {
            type: String,
            required: true // Path to uploaded prescription image file
        },
        status: {
            type: String,
            enum: ['Pending', 'Verified', 'Rejected'], // Workflow states for prescription processing
            default: 'Pending'
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // Reference to staff member who verified the prescription
        },
        verifiedAt: {
            type: Date // Timestamp when prescription was verified or rejected
        },
        notes: {
            type: String,
            default: '' // Additional notes from staff or customer
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true // Reference to prescribed medication product
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1 // Minimum quantity of 1 unit
                },
                dosage: {
                    type: String,
                    default: '' // Optional dosage instructions for the medication
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0 // Calculated total cost of prescribed products
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the Prescription model based on the schema
const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;