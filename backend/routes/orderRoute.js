// routes/orderRoute.js

import express from "express";
import {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from "../controller/orderController.js";

import { protect } from "../middlewares/authMiddleware.js"; // ✅ Import protect middleware

const router = express.Router();

// ✅ Customer places an order (must be logged in)
router.post("/create", protect, placeOrder);

// ✅ Admin or Staff views all orders
router.get("/", protect, getAllOrders);

// ✅ Customer views only their own orders
router.get("/my-orders", protect, getMyOrders);

// ✅ Admin or Customer gets a single order by ID
router.get("/:id", protect, getOrderById);

// ✅ Admin updates an order
router.patch("/:id", protect, updateOrder);

// ✅ Admin deletes an order
router.delete("/:id", protect, deleteOrder);

export default router;
