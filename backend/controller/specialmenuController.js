import SpecialMenu from "../models/specialmenumodel.js";

// Get all special menu items
export const getSpecialMenus = async (req, res) => {
  try {
    const menus = await SpecialMenu.find({});
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a special menu item
export const addSpecialMenu = async (req, res) => {
  const { name, description, price, availability, category, specialDay } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const newSpecialMenu = new SpecialMenu({
      name,
      description,
      price,
      availability,
      category,
      image,
      specialDay,
    });
    await newSpecialMenu.save();
    res.json(newSpecialMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a special menu item
export const deleteSpecialMenu = async (req, res) => {
  const { id } = req.params;

  try {
    await SpecialMenu.findByIdAndDelete(id);
    res.json({ message: "Special menu item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
