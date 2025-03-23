import express from "express";       // Express framework for creating HTTP server and routing
import multer from "multer";         // Middleware for handling file uploads
import path from "path";             // Node.js module for handling file and directory paths
import Menu from "../models/menumodel.js";  // Import the Menu model

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  // Set the filename for uploaded images
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({ storage });

// Utility function to get today's date in "MM-DD" format
const getTodayDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${month}-${day}`;
};

// Utility function to check if today is a weekend
const isWeekend = () => {
  const today = new Date();
  const day = today.getDay();
  return day === 0 || day === 6; // 0: Sunday, 6: Saturday
};

// Predefined special days (MM-DD format)
const specialDays = ["02-14", "04-14", "12-25", "12-31"];

// Route to get all menu items (including special menus)
router.get("/", async (req, res) => {
  try {
    let items;
    const todayDate = getTodayDate();

    // Check if today is a special day or weekend
    const isSpecialDay = specialDays.includes(todayDate) || isWeekend();

    if (isSpecialDay) {
      // Fetch both special and regular menu items on special days or weekends
      const specialItems = await Menu.find({ isSpecial: true });
      const regularItems = await Menu.find({ isSpecial: false });
      items = [...specialItems, ...regularItems];
    } else {
      // Fetch only regular menu items on normal days
      items = await Menu.find({ isSpecial: false });
    }

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to get a single menu item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Menu.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to add a new menu item
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, availability, category, isSpecial, specialDay } = req.body;
  const image = req.file ? req.file.filename : null;

  // Validate input fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new menu item object
    const newItem = new Menu({
      name,
      description,
      price: parseFloat(price),
      availability: availability ?? true,
      category,
      image,
      isSpecial: Boolean(isSpecial),  // Mark as special menu if indicated
      specialDay: specialDay || null, // Store special day if provided
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error saving item: " + error.message });
  }
});

// Route to update an existing menu item
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { name, description, price, availability, category, isSpecial, specialDay } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Find the menu item by ID and update it with new data
    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { name, description, price: parseFloat(price), availability, category, image, isSpecial, specialDay },
      { new: true } // Return the updated item
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item: " + error.message });
  }
});

// Route to delete a menu item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Find the menu item by ID and delete it from the database
    const deletedItem = await Menu.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item: " + error.message });
  }
});

export default router;
