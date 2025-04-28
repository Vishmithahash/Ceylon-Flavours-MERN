import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";  // Import connectDB

// Load environment variables FIRST
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Serve uploaded images as static files
app.use("/uploads", express.static("uploads"));
app.use("/upload", express.static("upload"));
app.use("/profileUploads", express.static("profileUploads"));


// Import routes
import menuRoutes from "./routes/menuroute.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import specialMenuRoutes from "./routes/specialmenuRoutes.js";
import reservationRouter from "./routes/Reservationroutes.js";
import reviewRoute from "./routes/reviewroute.js";
import orderRoutes from "./routes/orderRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Use main routes
app.use("/api/menu", menuRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/specialmenu", specialMenuRoutes);
app.use("/api/reservation", reservationRouter);
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoutes);

// Use User Management routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
