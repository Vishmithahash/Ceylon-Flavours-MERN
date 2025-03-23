import Menu from "../models/menumodel.js";  // Import the Menu model

// Get all menu items
export const getMenus = async (req, res) => {
    try {
        // Retrieve all menu items from the database
        const menus = await Menu.find();
        // Send the retrieved items as a JSON response
        res.json(menus);
    } catch (error) {
        // Handle any server errors and send an error response
        res.status(500).json({ message: error.message });
    }
};

// Add a new menu item
export const addMenu = async (req, res) => {
    // Extract fields from the request body
    const { name, description, price, availability, category } = req.body;
    // Get the image path if the file is uploaded
    const image = req.file ? req.file.path : "";

    try {
        // Create a new menu item with the provided data
        const newMenu = new Menu({ name, description, price, availability, category, image });
        // Save the new item to the database
        await newMenu.save();
        // Send the newly created menu item as a JSON response
        res.json(newMenu);
    } catch (error) {
        // Handle any errors during saving
        res.status(400).json({ message: error.message });
    }
};

// Update an existing menu item
export const updateMenu = async (req, res) => {
    // Extract the item ID from the request parameters
    const { id } = req.params;
    // Extract updated fields from the request body
    const { name, description, price, availability, category } = req.body;
    // Get the image path if the file is uploaded
    const image = req.file ? req.file.path : "";

    try {
        // Find the menu item by ID and update it with new data
        const updatedMenu = await Menu.findByIdAndUpdate(
            id,
            { name, description, price, availability, category, image },
            { new: true }  // Return the updated document
        );
        // Send the updated menu item as a JSON response
        res.json(updatedMenu);
    } catch (error) {
        // Handle any errors during updating
        res.status(400).json({ message: error.message });
    }
};

// Delete a menu item
export const deleteMenu = async (req, res) => {
    // Extract the item ID from the request parameters
    const { id } = req.params;

    try {
        // Find the menu item by ID and delete it from the database
        await Menu.findByIdAndDelete(id);
        // Send a success message after deletion
        res.json({ message: "Menu item deleted successfully" });
    } catch (error) {
        // Handle any errors during deletion
        res.status(500).json({ message: error.message });
    }
};
