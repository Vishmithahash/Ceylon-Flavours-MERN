import express from "express"

import { getConfirmedOrdersProxy } from "../controller/deliveryConfirmedOrderProxyController.js";
import { createDelivery,getAllDelivery,getDeliveryById,updateDelivery,deleteDelivery } from "../controller/deliveryController.js";




const deliveryRouter = express.Router();

deliveryRouter.post("/create",createDelivery)
deliveryRouter.get("/",getAllDelivery)
deliveryRouter.put("/update/:id",updateDelivery)
deliveryRouter.delete("/delete/:id",deleteDelivery)


deliveryRouter.get("/proxy-confirmed-orders", getConfirmedOrdersProxy);


export default deliveryRouter;