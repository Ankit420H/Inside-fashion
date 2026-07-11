import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    items: { type: Array, required: true },
    amount: { type: Number, required: true, min: 0 },
    address: { type: Object, required: true },
    status: {
      type: String,
      required: true,
      default: 'Order Placed',
      enum: ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['COD', 'Stripe', 'Razorpay'],
    },
    payment: { type: Boolean, required: true, default: false },
    date: { type: Number, required: true, index: true },
  },
  { timestamps: true }
);

// Compound index for user order lookups sorted by date
orderSchema.index({ userId: 1, date: -1 });

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;