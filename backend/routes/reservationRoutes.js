import express from "express";
import { getReservationByEmail } from "../controller/reservationController.js";////////////////////////////new
import {
    createReservation,
    getAllReservation,
    getReservationById,
    updateReservation,
    deleteReservation
} from "../controller/reservationController.js";

const router = express.Router();

router.post("/", createReservation);       // Create new reservation
router.get("/", getAllReservation);         // Get all reservations
router.get("/:id", getReservationById);      // Get one reservation by ID
router.put("/:id", updateReservation);       // Update reservation
router.delete("/:id", deleteReservation);    // Delete reservation

router.get("/user/:email", getReservationByEmail);//////////////////////////////////////////////////new

export default router;
