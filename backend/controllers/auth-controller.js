import User from '../models/user.js';
import Verification from '../models/verification.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { sendEmail } from '../libs/send-email.js';

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

// Register user controller
export const registerUser = async (req, res) => {
  try {
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Validation failed", errors: validation.error.errors });
    }

    const { name, email, password, confirmPassword } = validation.data;

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, property: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    const emailBody = `
      <h2>Welcome to TaskHub!</h2>
      <p>Hi ${name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verificationLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">Verify Email</a></p>
      <p>This link expires in 1 hour.</p>
    `;

    const emailSent = await sendEmail(email, "Verify your email - TaskHub", emailBody);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.status(201).json({ message: "Verification email sent. Please verify your email." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login user controller
export const loginUser = async (req, res) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Validation failed", errors: validation.error.errors });
    }

    const { email, password } = validation.data;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      let existingToken = await Verification.findOne({ userId: user._id });

      if (!existingToken || existingToken.expiresAt < new Date()) {
        if (existingToken) await Verification.deleteOne({ _id: existingToken._id });

        const verificationToken = jwt.sign(
          { userId: user._id, property: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        existingToken = await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        const emailBody = `
          <h2>Verify Your Email</h2>
          <p>Hi ${user.name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <p><a href="${verificationLink}" style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;">Verify Email</a></p>
          <p>This link expires in 1 hour.</p>
        `;

        const emailSent = await sendEmail(user.email, "Verify your email - TaskHub", emailBody);
        if (!emailSent) {
          return res.status(500).json({ message: "Failed to send verification email" });
        }
      }

      return res.status(400).json({ message: "Email not verified. Please check your email for verification link." });
    }

    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Login successful",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Verify email controller
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  if (!token) return res.status(400).json({ message: "Verification token is required" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.property !== "email-verification") {
      return res.status(400).json({ message: "Invalid token property" });
    }

    const verificationRecord = await Verification.findOne({ token });
    if (!verificationRecord) {
      return res.status(400).json({ message: "Verification token not found or already used" });
    }

    if (verificationRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Verification token expired" });
    }

    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.deleteOne({ token });

    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: "Email verified successfully",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified,
      }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid or expired verification token" });
  }
};

// Reset password request controller
export const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No account associated with this email" });
    }

    const resetToken = jwt.sign(
      { userId: user._id, property: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: user._id,
      token: resetToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailBody = `
      <h2>Reset Your Password</h2>
      <p>Hi ${user.name},</p>
      <p>Click the button below to reset your password:</p>
      <p><a href="${resetLink}" style="background:#f44336;color:white;padding:10px 20px;text-decoration:none;">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
    `;

    const emailSent = await sendEmail(email, "Reset your password - TaskHub", emailBody);
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" });
    }

    res.status(200).json({ message: "Password reset email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process password reset request", error: err.message });
  }
};

// Reset password controller
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Verify token and password reset logic
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.property !== "password-reset") {
      return res.status(400).json({ message: "Invalid token" });
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};


