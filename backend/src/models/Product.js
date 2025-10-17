import mongoose from "mongoose";

/**
 * Mongoose schema for Product entities.
 * Defines the data structure, validation rules, and pricing information
 * for products in the inventory management system.
 */
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
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
        expiryDate: {
            type: Date,
            required: true
        },
        lowStockNotified: {
            type: Boolean,
            default: false
        },
        expiryNotified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

// Index for efficient querying of low stock and near-expiry products
productSchema.index({ stock: 1 });
productSchema.index({ expiryDate: 1 });
productSchema.index({ lowStockNotified: 1 });
productSchema.index({ expiryNotified: 1 });

/**
 * Virtual for checking if product is low stock
 */
productSchema.virtual('isLowStock').get(function() {
    return this.stock < 10;
});

/**
 * Virtual for checking if product is near expiry
 */
productSchema.virtual('isNearExpiry').get(function() {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return this.expiryDate <= thirtyDaysFromNow;
});

/**
 * Mongoose model for the Product collection.
 * Provides an interface for interacting with product documents in MongoDB.
 */
const Product = mongoose.model("Product", productSchema);

export default Product;