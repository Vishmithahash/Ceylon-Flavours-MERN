import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controller/authController.js"; // ✅ Correct path (controllers)

import upload from "../middlewares/upload.js"; // ✅ Import upload middleware

// ========== Authentication Routes ==========

// @route   POST /api/auth/register
// @desc    Register new user
// @access  Public
router.post("/register", upload.single("profileImage"), registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginUser);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post("/forgot-password", forgotPassword);

// @route   PUT /api/auth/reset-password/:resetToken
// @desc    Reset password
// @access  Public
router.put("/reset-password/:resetToken", resetPassword);

export default router;
