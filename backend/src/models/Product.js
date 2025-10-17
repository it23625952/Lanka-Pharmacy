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
        stock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        }
    },
    { timestamps: true } // Automatically manages createdAt and updatedAt fields
);

/**
 * Mongoose model for the Product collection.
 * Provides an interface for interacting with product documents in MongoDB.
 */
const Product = mongoose.model("Product", productSchema);

export default Product;