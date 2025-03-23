import React, { useState } from "react";
import axios from "axios";

const Menu = () => {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [itemAvailability, setItemAvailability] = useState(true);
  const [itemCategory, setItemCategory] = useState("Appetizers");

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", itemDescription);
    formData.append("price", itemPrice);
    formData.append("availability", itemAvailability);
    formData.append("category", itemCategory);
    formData.append("image", itemImage);

    try {
      await axios.post("http://localhost:5000/api/menu", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Menu item added successfully!");
      alert("Menu item added successfully!");
      setItemName("");
      setItemDescription("");
      setItemPrice("");
      setItemImage(null);
      setItemAvailability(true);
      setItemCategory("Appetizers");
    } catch (error) {
      console.error("Error adding menu item:", error.response?.data || error.message);
      alert("Error adding menu item: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add Menu Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item name"
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Description</label>
            <input
              type="text"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Enter item description"
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Price</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              placeholder="Enter item price"
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600">Category</label>
            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            >
              <option value="Appetizers">Appetizers</option>
              <option value="Main Dishes">Main Dishes</option>
              <option value="Desserts">Desserts</option>
              <option value="Beverages">Beverages</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={itemAvailability}
              onChange={(e) => setItemAvailability(e.target.checked)}
              className="h-4 w-4 text-blue-500"
            />
            <label className="text-gray-600">Available</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
};

export default Menu;
