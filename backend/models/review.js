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

const student = mongoose.model("ItpStudent",userSchema)

export default review;