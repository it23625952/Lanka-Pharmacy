import * as CartModule from '../models/Cart.js';
const Cart = CartModule.default || CartModule;

// Add item to cart
export const addToCart = async (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;

  if (!userId || !productId) {
    console.warn('⚠️ Missing userId or productId in request body');
    return res.status(400).json({ error: 'userId and productId are required' });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });
      console.log(`🛒 New cart created for user ${userId}`);
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`🔁 Updated quantity for product ${productId}`);
      } else {
        cart.items.push({ productId, quantity });
        console.log(`➕ Added new product ${productId} to cart`);
      }
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    console.error('❌ Error adding to cart:', error.message);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
};

// Get cart items
export const getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      console.warn(`⚠️ No cart found for user ${userId}`);
      return res.json({ items: [] });
    }

    res.json({ items: cart.items });
  } catch (error) {
    console.error('❌ Error fetching cart:', error.message);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Update item quantity
export const updateItem = async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ 'items._id': itemId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: 'Item updated', cart });
  } catch (error) {
    console.error('❌ Error updating item:', error.message);
    res.status(500).json({ error: 'Failed to update item' });
  }
};

// Remove item from cart
export const removeItem = async (req, res) => {
  const { itemId } = req.params;

  try {
    const cart = await Cart.findOne({ 'items._id': itemId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({ message: 'Item removed', cart });
  } catch (error) {
    console.error('❌ Error removing item:', error.message);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = [];
    await cart.save();

    res.json({ message: 'Cart cleared', cart });
  } catch (error) {
    console.error('❌ Error clearing cart:', error.message);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
