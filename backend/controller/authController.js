import User from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ===== Register a New User =====
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const profileImage = req.file ? req.file.path.replace(/\\/g, "/") : "";

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const newUser = new User({ name, email, password, mobile, profileImage, role: "user" });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registration successful! Please login now." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

// ===== Login User =====
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please enter email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// ===== Forgot Password =====
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Please enter your email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email." });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    `;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: message,
    });

    res.status(200).json({ success: true, message: "Password reset email sent successfully." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sending reset email. Please try again later." });
  }
};

// ===== Reset Password =====
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired password reset token." });
    }

    if (!req.body.password || req.body.password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    user.password = req.body.password; // pre('save') will hash automatically
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully. You can now login." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error during password reset." });
  }
};
