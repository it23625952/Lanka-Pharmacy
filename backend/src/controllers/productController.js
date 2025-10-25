import Product from "../models/Product.js";
import path from "path";

/**
 * Retrieves all products from the database.
 * 
 * @param {Object} _ - Request object (unused)
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with products array or error message
 */
export async function getAllProducts(_, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * Retrieves a specific product by its ID.
 * Returns 404 status if no product is found with the given ID.
 * 
 * @param {Object} req - Request object containing product ID in params
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with product data or error message
 */
export async function getProductById(req, res) {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ "message": "Product not found!" });
        }
        res.json(product);
    } catch (error) {
        console.error("Error retrieving product:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Creates a new product in the database.
 * 
 * @param {Object} req - Request object containing product data in body
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with created product or error message
 */
export async function createProduct(req, res) {
    try {
        const { name, retailPrice, wholesalePrice, description, imageUrl, category, stock, expiryDate } = req.body;
        
        console.log('Creating product with data:', req.body);
        
        const newProduct = new Product({ 
            name, 
            retailPrice, 
            wholesalePrice, 
            description, 
            imageUrl, 
            category, 
            stock,
            expiryDate: new Date(expiryDate)
        });

        await newProduct.save();
        
        console.log('Product created successfully:', newProduct._id);
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Updates an existing product by its ID.
 * Returns 404 status if no product is found with the given ID.
 * 
 * @param {Object} req - Request object containing product ID and update data
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with success message or error
 */
export async function updateProduct(req, res) {
    try {
        const { name, retailPrice, wholesalePrice, description, imageUrl, category, stock, expiryDate } = req.body;
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { 
                name, 
                retailPrice, 
                wholesalePrice, 
                description, 
                imageUrl, 
                category, 
                stock,
                expiryDate: new Date(expiryDate)
            },
            { new: true } // Returns the updated document
        );

        if (!updatedProduct) {
            return res.status(404).json({ "message": "Product not found" });
        }

        res.status(200).json({ "message": "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Deletes a product by its ID.
 * Returns 404 status if no product is found with the given ID.
 * 
 * @param {Object} req - Request object containing product ID in params
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with success message or error
 */
export async function deleteProduct(req, res) {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ "message": "Product not found" });
        }

        res.status(200).json({ "message": "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Handles product image upload
 * @param {Object} req - Request object with file
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with image URL or error
 */
export const uploadProductImage = async (req, res) => {
    try {
        console.log('Uploading product image...', req.file);
        
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Construct the image URL for frontend access
        const imageUrl = `/uploads/products/${req.file.filename}`;
        
        console.log('Image uploaded successfully:', imageUrl);
        
        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: imageUrl
        });
    } catch (error) {
        console.error("Error uploading product image:", error);
        res.status(500).json({ message: "Server error while uploading image" });
    }
};