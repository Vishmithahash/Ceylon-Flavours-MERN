import express from "express";
import {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controller/orderController.js"; 

const router = express.Router();


router.post("/create", placeOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;




