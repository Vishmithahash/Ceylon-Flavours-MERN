import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [menuItem, setMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    availability: false,
    category: "Appetizers",
    specialDay: "",
    isSpecial: false,
    image: null,
    createdAt: "", // New state to track the item added date
  });

  // Fetch menu item details on component mount
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/menu/${id}`);
        setMenuItem(response.data);
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };
    fetchMenuItem();
  }, [id]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setMenuItem((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file change
  const handleImageChange = (event) => {
    setMenuItem((prev) => ({
      ...prev,
      image: event.target.files[0],
    }));
  };

  // Handle update submission
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", menuItem.name);
      formData.append("description", menuItem.description);
      formData.append("price", menuItem.price);
      formData.append("availability", menuItem.availability);
      formData.append("category", menuItem.category);
      formData.append("isSpecial", menuItem.isSpecial); // Update special menu flag
      formData.append("specialDay", menuItem.specialDay); // Update special day
      if (menuItem.image) {
        formData.append("image", menuItem.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/menu/${id}`,
        formData
      );

      if (response.status === 200) {
        alert("Item updated successfully!");
        navigate("/menutable", { replace: true });
      } else {
        alert("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("An error occurred while updating the item.");
    }
  };

  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Update Menu Item
      </h1>
      <form
        onSubmit={handleUpdate}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
        encType="multipart/form-data"
      >
        <label className="block mb-2">Name:</label>
        <input
          type="text"
          name="name"
          value={menuItem.name}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Description:</label>
        <textarea
          name="description"
          value={menuItem.description}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        />

        <label className="block mb-2">Price:</label>
        <input
          type="number"
          name="price"
          value={menuItem.price}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          min="0"
          required
        />

        <label className="block mb-2">Category:</label>
        <select
          name="category"
          value={menuItem.category}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
          required
        >
          <option value="Appetizers">Appetizers</option>
          <option value="Main Dishes">Main Dishes</option>
          <option value="Desserts">Desserts</option>
          <option value="Beverages">Beverages</option>
        </select>

        <label className="block mb-2">Availability:</label>
        <input
          type="checkbox"
          name="availability"
          checked={menuItem.availability}
          onChange={handleInputChange}
          className="mb-4"
        />

        <label className="block mb-2">Special Menu:</label>
        <input
          type="checkbox"
          name="isSpecial"
          checked={menuItem.isSpecial}
          onChange={handleInputChange}
          className="mb-4"
        />
        <label className="ml-2">Mark as Special Menu</label>

        {menuItem.isSpecial && (
          <>
            <label className="block mb-2">Special Day:</label>
            <input
              type="date"
              name="specialDay"
              value={menuItem.specialDay}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            />
          </>
        )}

        <label className="block mb-2">Image:</label>
        <input
          type="file"
          name="image"
          onChange={handleImageChange}
          className="mb-4"
        />

        <label className="block mb-2">Item Added Date:</label>
        <p className="mb-4">{formatDate(menuItem.createdAt)}</p>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Update Item
        </button>
      </form>
    </div>
  );
}

export default UpdateMenu;
