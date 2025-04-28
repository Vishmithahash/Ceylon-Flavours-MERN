import express from "express";
import multer from "multer";
import SpecialMenu from "../models/specialmenumodel.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage });

// Get all special menu items
router.get("/", async (req, res) => {
  try {
    const menus = await SpecialMenu.find({});
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a special menu item
router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, availability, category, specialDay } = req.body;
  const image = req.file ? req.file.filename : "";

  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" }); // <-- use RETURN here
  }

  try {
    const newSpecialMenu = new SpecialMenu({
      name,
      description,
      price: parseFloat(price),
      availability: availability ?? true,
      category,
      image,
      specialDay,
    });

    const savedMenu = await newSpecialMenu.save();
    res.status(201).json(savedMenu); // <-- Only one res.json()
  } catch (error) {
    res.status(500).json({ message: "Error saving special menu: " + error.message });
  }
});

// Delete a special menu item
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedMenu = await SpecialMenu.findByIdAndDelete(id);
    if (!deletedMenu) {
      return res.status(404).json({ message: "Special menu item not found" });
    }
    res.json({ message: "Special menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
