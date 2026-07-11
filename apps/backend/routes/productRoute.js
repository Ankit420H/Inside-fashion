import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addProductSchema, removeProductSchema, singleProductSchema } from '../schemas/productSchema.js';

const productRouter = express.Router();

productRouter.post('/add', adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), validateRequest(addProductSchema), addProduct);
productRouter.post('/remove', adminAuth, validateRequest(removeProductSchema), removeProduct);
productRouter.post('/single', validateRequest(singleProductSchema), singleProduct);
productRouter.get('/list',listProducts)

export default productRouter