import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true }
    }
  ],
  status: { type: String, default: 'Pending' }, // e.g., Pending, Confirmed, Shipped
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
