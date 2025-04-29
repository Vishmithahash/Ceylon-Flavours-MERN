import mongoose from "mongoose";


const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {                         // <-- Added
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    people: {
        type: Number,
        required: true
    },
    table_category: {                 // <-- Added
        type: String,
        enum: ["Normal", "VIP"],       // Limit choices to Normal or VIP
        required: true
    },
    specialRequest: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);



