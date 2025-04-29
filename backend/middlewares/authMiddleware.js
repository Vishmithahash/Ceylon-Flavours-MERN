import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Protect routes — both Admin and Users
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  try {
    // If admin-token directly set
    if (token === "admin-token") {
      req.user = { id: "admin123", role: "admin", name: "Admin" };
      return next();
    }

    // Otherwise verify normal user token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized, user not found" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Not authorized, invalid token" });
  }
};

// Only admins allowed
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Not authorized as admin" });
  }
};
