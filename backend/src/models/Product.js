import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        retailPrice: {
            type: Number,
            required: true
        },
        wholesalePrice: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        category: {
            type: String,
            required: true
        },
        batchNumber: {
            type: String,
            required: true
        },
        expiryDate: {
            type: Date,
            required: true
        },
        manufacturer: {
            type: String,
            default: ''
        },
        barcode: {
            type: String,
            default: ''
        }
    },
    { 
        timestamps: true
    }
);

// Ensure batch number is unique per product name
productSchema.index({ name: 1, batchNumber: 1 }, { unique: true });

export default mongoose.model("Product", productSchema);