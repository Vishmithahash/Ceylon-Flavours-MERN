import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

//  Load environment variables FIRST
dotenv.config();


const app = express();
const PORT = 5000;

//  Middleware
app.use(cors());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

// Importing routes
import menuRoutes from "./routes/menuroute.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import specialMenuRoutes from "./routes/specialmenuRoutes.js";




// Use routes
app.use('/api/menu', menuRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/specialmenu", specialMenuRoutes);


// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));


import reservationRouter from "./routes/Reservationroutes.js";
import reviewroute from "./routes/reviewroute.js";




app.use("/api/reservation", reservationRouter);
app.use('/api/reviews',reviewroute);

//import order routes
import orderRoutes from "./routes/orderRoute.js";
app.use("/api/orders", orderRoutes);




//import reservation routes

app.use("/api/reservation", reservationRouter);




//  Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));
app.use("/upload", express.static("upload"));


//  Ensure MongoDB URL is defined
if (!process.env.MONGODB_URL) {
    console.error(" Error: MONGODB_URL is not defined in .env file.");
    process.exit(1);
}

//  Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log(" MongoDB connected successfully");

        //  Start server only after DB connection
        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });

    }).catch((err) => {
        console.error(" MongoDB connection error:", err);
    });
