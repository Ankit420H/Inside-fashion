import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().optional(),
  zipcode: z.string().min(1, 'Zipcode is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone is required'),
});

export const placeOrderSchema = z.object({
  body: z.object({
    items: z.array(z.object({
      _id: z.string(),
      name: z.string(),
      price: z.number(),
      quantity: z.number().int().positive(),
      size: z.string(),
    })).min(1, 'At least one item is required'),
    amount: z.number().positive('Amount must be positive'),
    address: addressSchema,
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    status: z.enum(['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']),
  }),
});

export const verifyStripeSchema = z.object({
  body: z.object({
    orderId: z.string().min(1, 'Order ID is required'),
    success: z.string(),
  }),
});

export const verifyRazorpaySchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1, 'Razorpay order ID is required'),
  }),
});
