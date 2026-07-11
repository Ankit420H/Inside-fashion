import express from 'express'
import { addToCart, getUserCart, updateCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'
import { validateRequest } from '../middleware/validateRequest.js'
import { addToCartSchema, updateCartSchema } from '../schemas/cartSchema.js'

const cartRouter = express.Router()

cartRouter.post('/get', authUser, getUserCart)
cartRouter.post('/add', authUser, validateRequest(addToCartSchema), addToCart)
cartRouter.post('/update', authUser, validateRequest(updateCartSchema), updateCart)

export default cartRouter