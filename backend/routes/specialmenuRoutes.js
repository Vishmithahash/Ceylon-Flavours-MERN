import express from "express";       // Express framework for creating HTTP server and routing
import multer from "multer";         // Middleware for handling file uploads
import path from "path";             // Node.js module for handling file and directory paths
import { getSpecialMenus, addSpecialMenu, deleteSpecialMenu } from "../controllers/specialmenuController.js"; // Import controller functions

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



// Route to get all special menu items
router.get("/", async (req, res) => {
  try {
    const items = await getSpecialMenus(req, res);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to add a new special menu item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const savedItem = await addSpecialMenu(req, res);
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error saving special menu item: " + error.message });
  }
});

// Route to delete a special menu item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await deleteSpecialMenu(req, res);
    res.json({ message: "Special menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting special menu item: " + error.message });
  }
});

export default router;
