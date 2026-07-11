import { v2 as cloudinary } from 'cloudinary';
import productModel from '../models/productModel.js';

// Add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    if (!name || !description || !price || !category || !subCategory) {
      return res.status(400).json({ success: false, message: 'All product fields are required.' });
    }

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    const image4 = req.files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    if (images.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product image is required.' });
    }

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
        return result.secure_url;
      })
    );

    const productData = {
      name: name.trim(),
      description: description.trim(),
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === 'true',
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.status(201).json({ success: true, message: 'Product added successfully.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Add product error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to add product.' });
  }
};

// List all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ date: -1 });
    res.json({ success: true, products });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] List products error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

// Remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, message: 'Product removed successfully.' });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Remove product error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to remove product.' });
  }
};

// Get single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Single product error:`, error.message);
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };