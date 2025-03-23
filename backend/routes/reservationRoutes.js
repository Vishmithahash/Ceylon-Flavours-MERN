import express from "express"

import { createReservation,getAllReservation,getReservationById,updateReservation,deleteReservation } from "../controller/ReservationController.js";




const reservationRouter = express.Router();

reservationRouter.post("/create",createReservation)
reservationRouter.get("/",getAllReservation)
reservationRouter.put("/update/:id",updateReservation)
reservationRouter.delete("/delete/:id",deleteReservation)


export default reservationRouter;