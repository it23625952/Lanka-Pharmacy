import mongoose from 'mongoose';

/**
 * Mongoose schema for Order entities
 * Manages medication orders linked to prescriptions with full order lifecycle
 */
const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        prescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prescription',
            required: true
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },
                price: {
                    type: Number,
                    required: true
                },
                dosage: {
                    type: String,
                    default: ''
                }
            }
        ],
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Processing', 'Ready for Pickup', 'Completed', 'Cancelled'],
            default: 'Pending'
        },
        paymentStatus: {
            type: String,
            enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
            default: 'Pending'
        },
        paymentMethod: {
            type: String,
            enum: ['Cash on Delivery', 'Card Payment', 'Digital Wallet', 'Bank Transfer'],
            default: 'Cash on Delivery'
        },
        shippingAddress: {
            type: String,
            default: ''
        },
        notes: {
            type: String,
            default: ''
        },
        estimatedReadyTime: {
            type: Date
        },
        pickedUpAt: {
            type: Date
        },
        cancelledAt: {
            type: Date
        },
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        cancellationReason: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);

/**
 * Pre-save middleware to generate unique order number
 * Format: ORDYYMMDDXXX (e.g., ORD241215001)
 */
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Find the latest order for today to increment sequence
        const latestOrder = await this.constructor.findOne(
            { orderNumber: new RegExp(`^ORD${year}${month}${day}`) },
            { orderNumber: 1 },
            { sort: { orderNumber: -1 } }
        );

        let sequence = 1;
        if (latestOrder) {
            const lastSequence = parseInt(latestOrder.orderNumber.slice(-3));
            sequence = lastSequence + 1;
        }

        this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(3, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;