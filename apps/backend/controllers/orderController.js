import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

// Global variables
const currency = 'inr';
const deliveryCharge = 10;

// Gateway initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    if (!items?.length || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Items, amount, and address are required.' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'COD',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.status(201).json({ success: true, message: 'Order placed successfully.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Place order error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;
    const { origin } = req.headers;

    if (!items?.length || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Items, amount, and address are required.' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Stripe',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: 'payment',
      metadata: {
        orderId: newOrder._id.toString(),
        userId,
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Stripe order error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to create Stripe session.' });
  }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;

  try {
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Verify the order belongs to this user
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
    }

    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: 'Payment verified successfully.' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment was cancelled.' });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Stripe verify error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to verify payment.' });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    if (!items?.length || !amount || !address) {
      return res.status(400).json({ success: false, message: 'Items, amount, and address are required.' });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: 'Razorpay',
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    };

    // Use promise-based API instead of callback
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Razorpay order error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order.' });
  }
};

// Verify Razorpay payment
const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { razorpay_order_id } = req.body;

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Razorpay order ID is required.' });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid') {
      // Verify the order belongs to this user
      const order = await orderModel.findById(orderInfo.receipt);
      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found.' });
      }
      if (order.userId.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Unauthorized access to this order.' });
      }

      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: 'Payment successful.' });
    } else {
      res.json({ success: false, message: 'Payment failed or pending.' });
    }
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Razorpay verify error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to verify Razorpay payment.' });
  }
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fetch all orders error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Fetch user orders error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: 'Order ID and status are required.' });
    }

    const validStatuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, message: 'Status updated successfully.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update status error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

export {
  verifyRazorpay,
  verifyStripe,
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
};