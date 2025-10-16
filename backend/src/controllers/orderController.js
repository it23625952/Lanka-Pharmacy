import * as OrderModule from '../models/Order.js';
const Order = OrderModule.default || OrderModule;

// CREATE Order
export const createOrder = async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order data' });
  }

  try {
    const order = new Order({ userId, items });
    await order.save();
    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    console.error('❌ Error creating order:', error.message);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// READ Orders by User
export const getOrdersByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await Order.find({ userId }).populate('items.productId');
    res.json({ orders });
  } catch (error) {
    console.error('❌ Error fetching orders:', error.message);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// UPDATE Order Status
export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = status;
    await order.save();
    res.json({ message: 'Order updated', order });
  } catch (error) {
    console.error('❌ Error updating order:', error.message);
    res.status(500).json({ error: 'Failed to update order' });
  }
};

// DELETE Order
export const deleteOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const deleted = await Order.findByIdAndDelete(orderId);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order deleted', deleted });
  } catch (error) {
    console.error('❌ Error deleting order:', error.message);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};
