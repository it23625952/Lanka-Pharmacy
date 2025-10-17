import Product from '../models/Product.js';
import User from '../models/User.js';
import { sendEmail } from './emailService.js';

/**
 * Service for handling product notifications (low stock and near expiry)
 */
class NotificationService {
    /**
     * Check for low stock products and notify managers
     */
    async checkLowStockAndNotify() {
        try {
            const lowStockProducts = await Product.find({
                stock: { $lt: 10 },
                lowStockNotified: false
            });

            if (lowStockProducts.length === 0) return;

            // Get all managers
            const managers = await User.find({
                role: { $in: ['Owner', 'Manager'] }
            });

            if (managers.length === 0) return;

            // Prepare notification content
            const notificationContent = this.formatLowStockNotification(lowStockProducts);

            // Send notifications to all managers
            for (const manager of managers) {
                await this.sendManagerNotification(manager.email, 'Low Stock Alert', notificationContent);
            }

            // Mark products as notified
            await Product.updateMany(
                { _id: { $in: lowStockProducts.map(p => p._id) } },
                { lowStockNotified: true }
            );

            console.log(`Sent low stock notifications for ${lowStockProducts.length} products`);
        } catch (error) {
            console.error('Error in low stock notification:', error);
        }
    }

    /**
     * Check for near-expiry products and notify managers
     */
    async checkNearExpiryAndNotify() {
        try {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

            const nearExpiryProducts = await Product.find({
                expiryDate: { $lte: thirtyDaysFromNow },
                expiryNotified: false
            });

            if (nearExpiryProducts.length === 0) return;

            // Get all managers
            const managers = await User.find({
                role: { $in: ['Owner', 'Manager'] }
            });

            if (managers.length === 0) return;

            // Prepare notification content
            const notificationContent = this.formatExpiryNotification(nearExpiryProducts);

            // Send notifications to all managers
            for (const manager of managers) {
                await this.sendManagerNotification(manager.email, 'Expiry Alert', notificationContent);
            }

            // Mark products as notified
            await Product.updateMany(
                { _id: { $in: nearExpiryProducts.map(p => p._id) } },
                { expiryNotified: true }
            );

            console.log(`Sent expiry notifications for ${nearExpiryProducts.length} products`);
        } catch (error) {
            console.error('Error in expiry notification:', error);
        }
    }

    /**
     * Format low stock notification content
     */
    formatLowStockNotification(products) {
        let content = `🚨 LOW STOCK ALERT 🚨\n\n`;
        content += `The following products are running low on stock:\n\n`;

        products.forEach((product, index) => {
            content += `${index + 1}. ${product.name}\n`;
            content += `   Current Stock: ${product.stock}\n`;
            content += `   Category: ${product.category}\n`;
            content += `   Retail Price: LKR ${product.retailPrice.toFixed(2)}\n\n`;
        });

        content += `Please restock these items as soon as possible.\n`;
        content += `\nBest regards,\nLanka Pharmacy System`;

        return content;
    }

    /**
     * Format expiry notification content
     */
    formatExpiryNotification(products) {
        let content = `⚠️ EXPIRY ALERT ⚠️\n\n`;
        content += `The following products are nearing their expiry date:\n\n`;

        products.forEach((product, index) => {
            const daysUntilExpiry = Math.ceil((product.expiryDate - new Date()) / (1000 * 60 * 60 * 24));
            content += `${index + 1}. ${product.name}\n`;
            content += `   Expiry Date: ${product.expiryDate.toLocaleDateString()}\n`;
            content += `   Days Until Expiry: ${daysUntilExpiry}\n`;
            content += `   Current Stock: ${product.stock}\n`;
            content += `   Category: ${product.category}\n\n`;
        });

        content += `Please take appropriate action for these items.\n`;
        content += `\nBest regards,\nLanka Pharmacy System`;

        return content;
    }

    /**
     * Send notification to manager
     */
    async sendManagerNotification(managerEmail, subject, content) {
        try {
            await sendEmail({
                to: managerEmail,
                subject: `${subject} - Lanka Pharmacy`,
                text: content,
                html: content.replace(/\n/g, '<br>')
            });
        } catch (error) {
            console.error(`Failed to send notification to ${managerEmail}:`, error);
        }
    }

    /**
     * Reset notification flags (run periodically)
     */
    async resetNotificationFlags() {
        try {
            // Reset low stock notifications for products that are no longer low stock
            await Product.updateMany(
                { stock: { $gte: 10 }, lowStockNotified: true },
                { lowStockNotified: false }
            );

            // Reset expiry notifications for products that are no longer near expiry
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            
            await Product.updateMany(
                { expiryDate: { $gt: thirtyDaysFromNow }, expiryNotified: true },
                { expiryNotified: false }
            );

            console.log('Notification flags reset successfully');
        } catch (error) {
            console.error('Error resetting notification flags:', error);
        }
    }
}

export default new NotificationService();