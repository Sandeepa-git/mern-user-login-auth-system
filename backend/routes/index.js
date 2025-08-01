import express from 'express';

import authRoutes from "./auth.js";

const router = express.Router();

router.use('/auth', authRoutes);

import { resetPasswordRequest, resetPassword } from '../controllers/auth-controller.js';  // Import controllers
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password/:token', resetPassword);  // This needs to match frontend endpoint


export default router;