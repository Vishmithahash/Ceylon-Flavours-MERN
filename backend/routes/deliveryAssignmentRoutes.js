import express from "express";
import {
  assignDelivery,
  getAssignmentsForDeliveryPerson,
  getAssignmentByOrder,
  updateDeliveryStatus,
  uploadEBill,
} from "../controller/deliveryAssignmentController.js";

const router = express.Router();

router.post("/assign", assignDelivery);
router.get("/person/:id", getAssignmentsForDeliveryPerson);
router.get("/order/:orderId", getAssignmentByOrder);
router.patch("/status/:id", updateDeliveryStatus);
router.post("/upload-ebill/:id", uploadEBill);

export default router;
