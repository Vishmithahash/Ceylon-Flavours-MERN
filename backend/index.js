import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import clarifaiProxy from "./routes/clarifaiProxy.js";

// Load environment variables FIRST
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Ensure MongoDB URL is defined
if (!process.env.MONGODB_URL) {
  console.error("MONGODB_URL is not defined in .env file.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static file serving
app.use("/uploads", express.static("uploads"));
app.use("/upload", express.static("upload"));
app.use("/profileUploads", express.static("profileUploads"));

// Route imports
import menuRoutes from "./routes/menuroute.js";
import deliveryRouter from "./routes/deliveryRoutes.js";
import specialMenuRoutes from "./routes/specialmenuRoutes.js";
import reservationRouter from "./routes/reservationRoutes.js";
import reviewRoute from "./routes/reviewroute.js";
import orderRoutes from "./routes/orderRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import configRoutes from "./routes/configRoutes.js";  // (Add this import with others)


// Route usage
app.use("/api/menu", menuRoutes);
app.use("/api/delivery", deliveryRouter);
app.use("/api/specialmenu", specialMenuRoutes);
app.use("/api/reservations", reservationRouter); // consistent plural
app.use("/api/reviews", reviewRoute);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/config", configRoutes);  // (Add this use with others)

app.use("/api/clarifai", clarifaiProxy);


// Start server (ONLY ONE app.listen!)
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
