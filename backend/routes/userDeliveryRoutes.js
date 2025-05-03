import express from "express";
import { getUserDeliveries } from "../controller/userDeliveryController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-deliveries", protect, getUserDeliveries);

export default router;
