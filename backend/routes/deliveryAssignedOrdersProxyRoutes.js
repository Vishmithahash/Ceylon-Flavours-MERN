import express from "express";
import { getAssignedDeliveriesProxy } from "../controller/deliveryAssignedOrdersProxyController.js";

const router = express.Router();

router.get("/assigned-orders-proxy/:id", getAssignedDeliveriesProxy);

export default router;
