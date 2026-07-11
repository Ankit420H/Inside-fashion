import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: [String], required: true },
    category: { type: String, required: true, enum: ['Men', 'Women', 'Kids'] },
    subCategory: { type: String, required: true, enum: ['Topwear', 'Bottomwear', 'Winterwear'] },
    sizes: { type: [String], required: true },
    bestseller: { type: Boolean, default: false },
    date: { type: Number, required: true },
  },
  { timestamps: true }
);

// Index for category/subcategory filtering
productSchema.index({ category: 1, subCategory: 1 });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);

export default productModel;