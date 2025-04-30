import express from "express";
import multer from "multer";
import path from "path";
import SpecialMenu from "../models/specialmenumodel.js";

const router = express.Router();

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

/**
 * GET all special menu items
 */
router.get("/", async (req, res) => {
  try {
    const menus = await SpecialMenu.find({});
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET a single special menu item by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const menu = await SpecialMenu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: "Special menu item not found" });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * POST a new special menu item
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, availability, category, specialDay } = req.body;
    const image = req.file ? req.file.filename : "";

    console.log("🧾 Incoming special menu POST:");
    console.log({ name, description, price, availability, category, specialDay, image });

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
    res.status(201).json(savedMenu);
  } catch (error) {
    console.error("❌ Error creating special menu:", error);
    res.status(500).json({ message: "Error saving special menu: " + error.message });
  }
});

/**
 * PUT to update a special menu item by ID
 */
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, availability, category, specialDay } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      availability: availability === "true" || availability === true,
      category,
      specialDay,
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await SpecialMenu.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Special menu item not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating item: " + error.message });
  }
});

/**
 * DELETE a special menu item by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await SpecialMenu.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Special menu item not found" });
    }
    res.json({ message: "Special menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
