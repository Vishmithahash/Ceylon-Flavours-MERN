// --- menuRoute.js ---

import express from "express";
import multer from "multer";
import path from "path";
import Menu from "../models/menumodel.js";
import SpecialMenu from "../models/specialmenumodel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    const items = await Menu.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Menu.findById(id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  const { name, description, price, availability, category } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description || !price || !category)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const newItem = new Menu({
      name,
      description,
      price: parseFloat(price),
      availability: availability ?? true,
      category,
      image,
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Error saving item: " + error.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    availability,
    category,
    specialDay,
    isSpecial
  } = req.body;

  const image = req.file ? req.file.filename : null;

  try {
    if (isSpecial === "true") {
      const menuItem = await Menu.findById(id);
      if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

      const specialMenu = new SpecialMenu({
        name,
        description,
        price: parseFloat(price),
        availability: availability ?? true,
        category,
        image: image || menuItem.image,
        specialDay,
      });

      await specialMenu.save();
      await Menu.findByIdAndDelete(id);

      return res.status(200).json({ message: "Converted to special menu successfully" });
    }

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      availability: availability ?? true,
      category,
    };
    if (image) updateData.image = image;

    const updatedItem = await Menu.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedItem) return res.status(404).json({ message: "Menu item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item: " + error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Menu.findByIdAndDelete(id);
    if (!deletedItem) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item: " + error.message });
  }
});

export default router;
