import express from "express";
import multer from "multer";
import path from "path";
import Review from "../models/reviewmodel.js"; // Assuming your review schema is in reviewmodel.js

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/"); // Save images in the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});




const upload = multer({ storage });

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }); // Sort by latest reviews first
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Get a single review by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


// Add a new review (with image)
router.post("/", upload.single("image"), async (req, res) => {
    const { rating, title, review, email } = req.body;
    const image = req.file ? req.file.filename : null;
  
    // Check if all fields are provided
    if (!rating || !title || !review || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const newReview = new Review({
        rating,
        title,
        review,
        email,
        image,
      });
  
      // Save the review to the database
      const savedReview = await newReview.save();
  
      // Send success response
      res.status(201).json({ message: "Review added successfully!", data: savedReview });
    } catch (error) {
      res.status(500).json({ message: "Error saving review: " + error.message });
    }
  });
  
// Update an existing review (with image)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { rating, title, review, email } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { rating, title, review, email, image },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review: " + error.message });
  }
});

// Delete a review
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review: " + error.message });
  }
});
export default router;
