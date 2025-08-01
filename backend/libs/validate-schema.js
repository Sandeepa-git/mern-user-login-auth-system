import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

// Optional: reset password request schema
const resetPasswordRequestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Reset Password Schema
const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,  // Export this for usage
};
