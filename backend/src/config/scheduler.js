import cron from 'node-cron';
import NotificationService from './notificationService.js';

/**
 * Scheduled tasks for automated notifications
 */
class Scheduler {
    constructor() {
        this.initScheduledTasks();
    }

    initScheduledTasks() {
        // Check for low stock and near expiry every day at 9:00 AM
        cron.schedule('0 9 * * *', async () => {
            console.log('Running scheduled notification checks...');
            await NotificationService.checkLowStockAndNotify();
            await NotificationService.checkNearExpiryAndNotify();
        });

        // Reset notification flags every Monday at 8:00 AM
        cron.schedule('0 8 * * 1', async () => {
            console.log('Resetting notification flags...');
            await NotificationService.resetNotificationFlags();
        });

        console.log('Scheduled tasks initialized');
    }
}

export default new Scheduler();