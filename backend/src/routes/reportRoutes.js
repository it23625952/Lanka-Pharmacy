import express from "express";
import Staff from "../models/Staff.js";
import Attendance from "../models/Attendance.js";
import Salary from "../models/Salary.js";
import Order from "../models/Order.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// Staff summary report (existing endpoint)
router.get("/summary", async (req, res) => {
  try {
    const totalStaff = await Staff.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const presentToday = await Attendance.countDocuments({
      date: { $gte: todayStart, $lte: todayEnd },
      status: "Present"
    });

    const absentToday = totalStaff - presentToday;
    const salaries = await Salary.find();
    const totalSalary = salaries.reduce((sum, s) => sum + (s.amount || 0), 0);

    res.json({ totalStaff, presentToday, absentToday, totalSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch report summary" });
  }
});

// Order volume analytics endpoint
router.get("/order-volume", authenticate, async (req, res) => {
  try {
    console.log('=== ORDER VOLUME ANALYTICS REQUEST ===');
    console.log('Query params:', req.query);
    
    const { range = '7days' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    console.log('Date range:', { startDate, now, range });

    // Get orders in date range
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    }).populate('items.product');

    console.log('Found orders:', orders.length);

    // Calculate summary statistics
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    const cancelledOrders = orders.filter(order => order.status === 'Cancelled').length;
    const totalRevenue = orders
      .filter(order => order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Daily orders data
    const dailyOrders = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= now) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayOrders = orders.filter(order => {
        const orderDate = order.createdAt.toISOString().split('T')[0];
        return orderDate === dateStr;
      });
      
      dailyOrders.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders
          .filter(order => order.status !== 'Cancelled')
          .reduce((sum, order) => sum + order.totalAmount, 0)
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Order status distribution
    const orderStatusDistribution = [
      { name: 'Completed', value: completedOrders },
      { name: 'Pending', value: pendingOrders },
      { name: 'Processing', value: orders.filter(order => order.status === 'Processing').length },
      { name: 'Ready for Pickup', value: orders.filter(order => order.status === 'Ready for Pickup').length },
      { name: 'Cancelled', value: cancelledOrders }
    ];

    // Payment method distribution
    const paymentMethods = ['Cash on Delivery', 'Card Payment', 'Digital Wallet', 'Bank Transfer'];
    const paymentMethodDistribution = paymentMethods.map(method => ({
      name: method,
      value: orders.filter(order => order.paymentMethod === method).length
    }));

    // Top products
    const productOrders = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productName = item.product?.name || 'Unknown Product';
        productOrders[productName] = (productOrders[productName] || 0) + item.quantity;
      });
    });

    const topProducts = Object.entries(productOrders)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([name, orders]) => ({ name, orders }));

    const responseData = {
      summary: {
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue,
        averageOrderValue
      },
      dailyOrders,
      orderStatusDistribution,
      paymentMethodDistribution,
      topProducts
    };

    console.log('Sending response data:', responseData);
    res.json(responseData);

  } catch (error) {
    console.error('Error fetching order volume data:', error);
    res.status(500).json({ message: "Server error while fetching order volume data" });
  }
});

export default router;