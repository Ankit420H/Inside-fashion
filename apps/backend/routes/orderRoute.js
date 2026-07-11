import express from 'express'
import {placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, verifyStripe, verifyRazorpay} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { placeOrderSchema, updateStatusSchema, verifyStripeSchema, verifyRazorpaySchema } from '../schemas/orderSchema.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, validateRequest(updateStatusSchema), updateStatus)

// Payment Features
orderRouter.post('/place', authUser, validateRequest(placeOrderSchema), placeOrder)
orderRouter.post('/stripe', authUser, validateRequest(placeOrderSchema), placeOrderStripe)
orderRouter.post('/razorpay', authUser, validateRequest(placeOrderSchema), placeOrderRazorpay)

// User Feature
orderRouter.post('/userorders', authUser, userOrders)

// verify payment
orderRouter.post('/verifyStripe', authUser, validateRequest(verifyStripeSchema), verifyStripe)
orderRouter.post('/verifyRazorpay', authUser, validateRequest(verifyRazorpaySchema), verifyRazorpay)

export default orderRouter