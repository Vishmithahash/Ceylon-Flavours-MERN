import express from "express";
const router = express.Router();

import {
  getAllUsers,
  getUserById,
  updateUserByAdmin,
  deleteUserByAdmin,
  createUserByAdmin,
} from "../controller/adminController.js"; // ✅ Correct folder 'controllers'

import { protect, admin } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/upload.js"; // ✅ Import upload middleware for profileImage

// ========== Admin Manage Users ==========

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/users", protect, admin, getAllUsers);

// @route   POST /api/admin/users
// @desc    Create new user
// @access  Private/Admin
router.post("/users", protect, admin, upload.single("profileImage"), createUserByAdmin);

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get("/users/:id", protect, admin, getUserById);

// @route   PUT /api/admin/users/:id
// @desc    Update user by ID
// @access  Private/Admin
router.put("/users/:id", protect, admin, upload.single("profileImage"), updateUserByAdmin);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user by ID
// @access  Private/Admin
router.delete("/users/:id", protect, admin, deleteUserByAdmin);

export default router;
