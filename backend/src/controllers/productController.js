import Product from "../models/Product.js";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (make sure this is at the top)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
/**
 * Checks if batch number already exists for the same product
 */
const checkBatchExists = async (productName, batchNumber) => {
    const existingProduct = await Product.findOne({
        name: productName,
        batchNumber: batchNumber
    });
    return !!existingProduct;
};

export async function createProduct(req, res) {
    try {
        const { name, retailPrice, wholesalePrice, description, imageUrl, category, stock, batchNumber, expiryDate, manufacturer, barcode } = req.body;

        // Check if batch already exists for this product
        const batchExists = await checkBatchExists(name, batchNumber);
        if (batchExists) {
            return res.status(400).json({ 
                "message": "Batch number already exists for this product. Please use a different batch number." 
            });
        }

        const newProduct = new Product({ 
            name, 
            retailPrice, 
            wholesalePrice, 
            description, 
            imageUrl, 
            category,
            stock,
            batchNumber,
            expiryDate,
            manufacturer,
            barcode
        });

        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                "message": "Duplicate batch detected. This batch number already exists for the same product." 
            });
        }
        console.error("Error creating product:", error);
        res.status(500).json({ "message": "Server error" });
    }
};

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

        res.status(200).json(updatedProduct); // Return the updated product

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

        // Delete image from Cloudinary if it's a Cloudinary URL
        if (deletedProduct.imageUrl && deletedProduct.imageUrl.includes('cloudinary.com')) {
            try {
                const publicId = deletedProduct.imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log('Product image deleted from Cloudinary:', publicId);
            } catch (cloudinaryError) {
                console.error('Error deleting image from Cloudinary:', cloudinaryError);
                // Continue with product deletion even if image deletion fails
            }
        }

        res.status(200).json({ "message": "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Handles product image upload to Cloudinary
 * @param {Object} req - Request object with file
 * @param {Object} res - Response object
 * @returns {Promise<void>} JSON response with image URL or error
 */
export const uploadProductImage = async (req, res) => {
    try {
        console.log('Uploading product image to Cloudinary...', req.file);
        
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',
            transformation: [
                { width: 800, height: 800, crop: 'limit', quality: 'auto' }
            ]
        });

        console.log('Cloudinary upload result:', result);
        
        // Return the secure URL from Cloudinary
        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url
        });
    } catch (error) {
        console.error("Error uploading product image to Cloudinary:", error);
        res.status(500).json({ message: "Server error while uploading image" });
    }
};