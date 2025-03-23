import Menu from "../models/menumodel.js";

// Utility function to check if today is a special day
const isSpecialDay = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // Months are zero-based
  const day = today.getDate();
  const weekday = today.getDay(); // Sunday - Saturday : 0 - 6

  // Special Days (Month-Day)
  const specialDays = [
    "2-14",  // Valentine's Day
    "4-14",  // Sinhala and Tamil New Year
    "12-25", // Christmas
    "12-31", // New Year's Eve
  ];

  // Weekend Special (Saturday and Sunday)
  if (weekday === 0 || weekday === 6) {
    return "Weekend";
  }

  const todayStr = `${month}-${day}`;
  if (specialDays.includes(todayStr)) {
    return todayStr;
  }

  return null;
};

// Get all menu items (with special menu handling)
export const getMenus = async (req, res) => {
  try {
    const specialDay = isSpecialDay();

    let menus;
    if (specialDay) {
      // Find special menus for the special day or weekends
      menus = await Menu.find({ isSpecial: true, specialDay: { $in: [specialDay, "Weekend"] } });
      console.log(`Displaying special menu for: ${specialDay}`);
    }

    if (!menus || menus.length === 0) {
      // Fallback to regular menu if no special menu exists
      menus = await Menu.find({ isSpecial: false });
      console.log("Displaying regular menu");
    }

    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new menu item
export const addMenu = async (req, res) => {
  const { name, description, price, availability, category, isSpecial, specialDay } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const newMenu = new Menu({ name, description, price, availability, category, image, isSpecial, specialDay });
    await newMenu.save();
    res.json(newMenu);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing menu item
export const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, availability, category, isSpecial, specialDay } = req.body;
  const image = req.file ? req.file.path : "";

  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { name, description, price, availability, category, image, isSpecial, specialDay },
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
