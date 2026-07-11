import { z } from 'zod';

// The body fields are sent as multipart/form-data strings, so we validate strings
export const addProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a valid positive number',
    }),
    category: z.string().min(1, 'Category is required'),
    subCategory: z.string().min(1, 'SubCategory is required'),
    sizes: z.string().refine((val) => {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) && parsed.length > 0;
      } catch {
        return false;
      }
    }, 'Sizes must be a valid JSON array string with at least one size'),
    bestseller: z.string().optional(),
  }),
});

export const removeProductSchema = z.object({
  body: z.object({
    id: z.string().min(1, 'Product ID is required'),
  }),
});

export const singleProductSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
  }),
});
