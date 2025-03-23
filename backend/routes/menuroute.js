// Import required modules
import express from "express";       // Express framework for creating HTTP server and routing
import multer from "multer";         // Multer for handling file uploads
import path from "path";             // Path module to work with file and directory paths
import Menu from "../models/menumodel.js"; // Import the Menu model from the models folder

// Create a new Express router
const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  // Specify the destination folder for uploaded images
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in the 'uploads' folder
  },
  // Set the filename for uploaded images
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Generate a unique suffix using current time and random number
    const ext = path.extname(file.originalname); // Get the file extension from the original filename
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Construct the new filename
  },
});

// Create an upload instance using multer with the configured storage settings
const upload = multer({ storage });

// Route to get all menu items
router.get("/", async (req, res) => {
  try {
    // Fetch all menu items from the database
    const items = await Menu.find();
    // Return the items as a JSON response
    res.json(items);
  } catch (error) {
    // Handle any server errors during data fetching
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to get a single menu item by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  try {
    // Find the menu item by ID in the database
    const item = await Menu.findById(id);
    // If item is not found, return a 404 response
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    // Return the found item as a JSON response
    res.json(item);
  } catch (error) {
    // Handle any server errors during data fetching
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

// Route to add a new menu item (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  // Extract the required fields from the request body
  const { name, description, price, availability, category } = req.body;
  // Check if an image file was uploaded, and get the filename
  const image = req.file ? req.file.filename : null;

  // Validate input fields
  if (!name || !description || !price || !category) {
    return res.status(400).json({ message: "All fields are required" }); // Return a 400 error if any field is missing
  }

  try {
    // Create a new menu item object
    const newItem = new Menu({
      name,
      description,
      price: parseFloat(price),  // Convert price to a floating-point number
      availability: availability ?? true, // Set availability to true if not provided
      category, // Store the category of the menu item
      image,    // Store the image filename (if available)
    });

    // Save the new item to the database
    const savedItem = await newItem.save();
    // Return the saved item as a JSON response
    res.status(201).json(savedItem);
  } catch (error) {
    // Handle any errors during saving
    res.status(500).json({ message: "Error saving item: " + error.message });
  }
});

// Route to update an existing menu item (with image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters
  // Extract updated fields from the request body
  const { name, description, price, availability, category } = req.body;
  // Check if an image file was uploaded, and get the filename
  const image = req.file ? req.file.filename : null;

  try {
    // Find the menu item by ID and update it with new data
    const updatedItem = await Menu.findByIdAndUpdate(
      id,
      { name, description, price: parseFloat(price), availability, category, image },
      { new: true } // Return the updated item after modification
    );

    // If item is not found, return a 404 response
    if (!updatedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Return the updated item as a JSON response
    res.json(updatedItem);
  } catch (error) {
    // Handle any errors during updating
    res.status(500).json({ message: "Error updating item: " + error.message });
  }
});

// Route to delete a menu item by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Find the menu item by ID and delete it from the database
    const deletedItem = await Menu.findByIdAndDelete(id);

    // If item is not found, return a 404 response
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Return a success message as a JSON response
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    // Handle any errors during deletion
    res.status(500).json({ message: "Error deleting item: " + error.message });
  }
});

// Export the router for use in other parts of the application
export default router;
