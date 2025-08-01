import express from 'express';
import { z } from 'zod';

import {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  resetPassword, // ✅ Added
} from '../controllers/auth-controller.js';

import { validateRequest } from 'zod-express-middleware';
import { loginSchema, registerSchema } from '../libs/validate-schema.js';

const router = express.Router();

router.post('/register', validateRequest({ body: registerSchema }), registerUser);
router.post('/login', validateRequest({ body: loginSchema }), loginUser);
router.get('/verify-email/:token', verifyEmail);

// ✅ Reset password request
const resetPasswordSchema = z.object({
  email: z.string().email(),
});
router.post(
  '/reset-password-request',
  validateRequest({ body: resetPasswordSchema }),
  resetPasswordRequest
);

// ✅ Reset password with token
router.post('/reset-password/:token', resetPassword); // <-- Add this route

export default router;
