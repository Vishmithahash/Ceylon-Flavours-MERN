import express from "express"

import { createDelivery,getAllDelivery,getDeliveryById,updateDelivery,deleteDelivery } from "../controller/deliveryController.js";




const deliveryRouter = express.Router();

deliveryRouter.post("/create",createDelivery)
deliveryRouter.get("/",getAllDelivery)
deliveryRouter.put("/update/:id",updateDelivery)
deliveryRouter.delete("/delete/:id",deleteDelivery)


export default deliveryRouter;