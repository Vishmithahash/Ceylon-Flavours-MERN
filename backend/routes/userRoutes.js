import express from "express";
const router = express.Router();

import { getUserProfile, updateUserProfile } from "../controller/userController.js"; // ✅ Corrected 'controllers'
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js"; // ✅ Import upload

// ========== User Profile Routes ==========

// @route   GET /api/user/profile
// @desc    Get logged-in user's profile
// @access  Private
router.get("/profile", protect, getUserProfile);

// @route   PUT /api/user/profile
// @desc    Update logged-in user's profile
// @access  Private
router.put("/profile", protect, upload.single("profileImage"), updateUserProfile);

export default router;
