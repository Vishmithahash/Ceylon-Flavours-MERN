
import Menu from "../models/menumodel.js";
import fs from "fs";
import path from "path";
import axios from "axios";

// Helper function to validate image with Clarifai
const validateFoodImage = async (imagePath) => {
  const CLARIFAI_API_KEY = process.env.CLARIFAI_API_KEY;
  const CLARIFAI_USER_ID = process.env.CLARIFAI_USER_ID;
  const CLARIFAI_APP_ID = process.env.CLARIFAI_APP_ID;
  const CLARIFAI_WORKFLOW_ID = process.env.CLARIFAI_WORKFLOW_ID;

  const base64Image = fs.readFileSync(imagePath, { encoding: "base64" });

  const response = await axios.post(
    `https://api.clarifai.com/v2/users/${CLARIFAI_USER_ID}/apps/${CLARIFAI_APP_ID}/workflows/${CLARIFAI_WORKFLOW_ID}/results`,
  
    {
      user_app_id: {
        user_id: CLARIFAI_USER_ID,
        app_id: CLARIFAI_APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              base64: base64Image,
            },
          },
        },
      ],
    },
    {
      headers: {
        Authorization: `Key ${CLARIFAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const output = response.data?.results?.[0]?.outputs?.[0]?.data?.concepts;
  const topConcept = output?.[0]?.name?.toLowerCase();
  return topConcept === "food" || topConcept?.includes("food");
};

// Get all menu items
export const getMenus = async (req, res) => {
  try {
    const menus = await Menu.find({});
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new menu item
export const addMenu = async (req, res) => {
  const { name, description, price, availability, category } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const isValid = await validateFoodImage(image);
    if (!isValid) {
      return res.status(400).json({ message: "Image does not appear to be food." });
    }

    const newMenu = new Menu({
      name,
      description,
      price,
      availability,
      category,
      image,
    });
    await newMenu.save();
    res.json(newMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing menu item
export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, availability, category } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        availability,
        category,
        image,
      },
      { new: true }
    );
    res.json(updatedMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a menu item
export const deleteMenu = async (req, res) => {
  const { id } = req.params;

  try {
    await Menu.findByIdAndDelete(id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
