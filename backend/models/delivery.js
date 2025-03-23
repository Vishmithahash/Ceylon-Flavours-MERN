import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    DeliveryPersonID : {
        type : String,
        required : true
    },
    DeliveryPersonName : {
        type : String,
        required : true
    },
    DeliveryPersonContactNo : {
        type : String,
        required : true
    },
    VehicleNo : {
        type : String,
        required : true
    },
    Status : {
        type : String,
        required : true
    },
   
})

const delivery = mongoose.model("Deliveries",userSchema)

export default delivery