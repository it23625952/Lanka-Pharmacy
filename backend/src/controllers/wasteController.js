import Product from "../models/Product.js";
import mongoose from "mongoose";

/**
 * Get waste analytics dashboard data
 */
export async function getWasteAnalytics(req, res) {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const sixtyDaysFromNow = new Date();
        sixtyDaysFromNow.setDate(today.getDate() + 60);

        // Products expiring in next 30 days (critical)
        const criticalExpiry = await Product.find({
            expiryDate: { 
                $gte: today, 
                $lte: thirtyDaysFromNow 
            },
            stock: { $gt: 0 }
        }).sort({ expiryDate: 1 });

        // Products expiring in 31-60 days (warning)
        const warningExpiry = await Product.find({
            expiryDate: { 
                $gte: thirtyDaysFromNow, 
                $lte: sixtyDaysFromNow 
            },
            stock: { $gt: 0 }
        }).sort({ expiryDate: 1 });

        // Expired products
        const expiredProducts = await Product.find({
            expiryDate: { $lt: today },
            stock: { $gt: 0 }
        });

        // Calculate total potential waste value
        const criticalWasteValue = criticalExpiry.reduce((sum, product) => 
            sum + (product.retailPrice * product.stock), 0
        );
        
        const warningWasteValue = warningExpiry.reduce((sum, product) => 
            sum + (product.retailPrice * product.stock), 0
        );
        
        const expiredWasteValue = expiredProducts.reduce((sum, product) => 
            sum + (product.retailPrice * product.stock), 0
        );

        res.json({
            criticalExpiry: {
                products: criticalExpiry,
                count: criticalExpiry.length,
                totalValue: criticalWasteValue
            },
            warningExpiry: {
                products: warningExpiry,
                count: warningExpiry.length,
                totalValue: warningWasteValue
            },
            expiredProducts: {
                products: expiredProducts,
                count: expiredProducts.length,
                totalValue: expiredWasteValue
            },
            summary: {
                totalAtRisk: criticalExpiry.length + warningExpiry.length + expiredProducts.length,
                totalWasteValue: criticalWasteValue + warningWasteValue + expiredWasteValue,
                criticalCount: criticalExpiry.length,
                warningCount: warningExpiry.length,
                expiredCount: expiredProducts.length
            }
        });

    } catch (error) {
        console.error("Error fetching waste analytics:", error);
        res.status(500).json({ "message": "Server error" });
    }
}

/**
 * Mark product as wasted/discarded
 */
export async function markAsWasted(req, res) {
    try {
        const { productId, wastedQuantity, reason } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ "message": "Product not found" });
        }

        // Create waste record
        const wasteRecord = {
            productId: product._id,
            productName: product.name,
            batchNumber: product.batchNumber,
            wastedQuantity: Math.min(wastedQuantity, product.stock),
            reason: reason || 'Expired',
            wastedValue: product.retailPrice * Math.min(wastedQuantity, product.stock),
            wastedAt: new Date()
        };

        // Update product stock
        const originalStock = product.stock;
        product.stock = Math.max(0, product.stock - wastedQuantity);
        await product.save();

        console.log(`Marked product as wasted: ${product.name}, Stock: ${originalStock} -> ${product.stock}`);

        res.json({ 
            message: "Product marked as wasted successfully",
            wasteRecord,
            updatedStock: product.stock
        });

    } catch (error) {
        console.error("Error marking product as wasted:", error);
        res.status(500).json({ "message": "Server error" });
    }
}