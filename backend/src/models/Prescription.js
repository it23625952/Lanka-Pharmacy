import mongoose from 'mongoose';

/**
 * Mongoose schema for Prescription entities
 * Manages prescription uploads, verification, and associated medication orders
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
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Verified', 'Rejected'],
            default: 'Pending'
        },
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verifiedAt: {
            type: Date
        },
        notes: {
            type: String,
            default: ''
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                dosage: {
                    type: String,
                    default: ''
                }
            }
        ],
        totalAmount: {
            type: Number,
            default: 0
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    },
    { timestamps: true }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;