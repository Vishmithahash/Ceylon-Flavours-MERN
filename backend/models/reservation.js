import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },

    email : {
        type : String,
        required : true,
    },

    phone : {
        type : Number,
        required : true,


    },
    date: {
        type: String,
        required: true,
    },


    time: {
        type: String,
        required: true,
    },


    no_of_guests: {
        type: Number,
        required: true,
    },
    

    table_category: {
        type: String,
        enum: ["Normal", "VIP"],
        required: true,
        default: "Normal",  // Set a default value if none is provided
      },

      notes: {
        type: String,
        required: false,
    },


})

const reservation = mongoose.model("Reservations",userSchema)

export default reservation
