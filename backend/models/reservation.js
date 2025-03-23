import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    age : {
        type : Number,
        required : true
    },
    subject : {
        type : String,
        required : true
    }

})

const reservation = mongoose.model("Reservations",userSchema)

export default reservation