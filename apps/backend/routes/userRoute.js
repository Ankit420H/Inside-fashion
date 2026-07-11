import express from 'express';
import { loginUser,registerUser,adminLogin } from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { registerSchema, loginSchema, adminLoginSchema } from '../schemas/userSchema.js';

const userRouter = express.Router();

userRouter.post('/register', validateRequest(registerSchema), registerUser)
userRouter.post('/login', validateRequest(loginSchema), loginUser)
userRouter.post('/admin', validateRequest(adminLoginSchema), adminLogin)

export default userRouter;