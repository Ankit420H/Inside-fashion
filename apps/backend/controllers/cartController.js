import userModel from '../models/userModel.js';

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: 'Item ID and size are required.' });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: 'Added to cart.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Add to cart error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to add item to cart.' });
  }
};

// Update user cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Item ID, size, and quantity are required.' });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const cartData = userData.cartData || {};

    // Ensure the item and size exist before updating
    if (!cartData[itemId]) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    cartData[itemId][size] = quantity;

    // Clean up items with zero quantity
    if (quantity <= 0) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: 'Cart updated.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Update cart error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to update cart.' });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Get cart error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch cart.' });
  }
};

export { addToCart, updateCart, getUserCart };