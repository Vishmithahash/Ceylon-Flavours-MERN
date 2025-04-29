import Menu from "../models/menumodel.js";

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
