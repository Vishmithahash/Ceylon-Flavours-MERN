import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Menu() {
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [itemAvailability, setItemAvailability] = useState(true);
  const [itemCategory, setItemCategory] = useState("Appetizers");
  const [isSpecial, setIsSpecial] = useState(false);
  const [specialDay, setSpecialDay] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const allowedSpecialDates = ["02-14", "04-14", "12-25", "12-31"];

  const filterDate = (date) => {
    const day = date.getDay();
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    const formatted = `${String(month).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
    return day === 0 || day === 6 || allowedSpecialDates.includes(formatted);
  };

  const handleImageChange = (e) => {
    setItemImage(e.target.files[0]);
  };

  const validateFoodImage = async () => {
    const formData = new FormData();
    formData.append("image", itemImage);

    const response = await axios.post("http://localhost:5000/api/clarifai/validate-image", formData);

    const concepts = response.data?.results?.[0]?.outputs?.[0]?.data?.concepts;
    const match = concepts.some(concept =>
      concept.name.toLowerCase().includes(itemName.toLowerCase())
    );

    return match;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(itemPrice) < 0) {
      setErrorMessage("Price cannot be negative.");
      return;
    }
    if (!itemImage) {
      setErrorMessage("Please upload an image.");
      return;
    }
    if (isSpecial && !specialDay) {
      setErrorMessage("Please select a valid special day.");
      return;
    }

    try {
      const isValidImage = await validateFoodImage();
      if (!isValidImage) {
        alert("Uploaded image does not match the item name.");
        return;
      }

      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("description", itemDescription);
      formData.append("price", itemPrice);
      formData.append("availability", itemAvailability);
      formData.append("category", itemCategory);
      formData.append("image", itemImage);
      formData.append("isSpecial", isSpecial ? "true" : "false");
      formData.append("specialDay", specialDay ? specialDay.toISOString() : "");

      const url = isSpecial
        ? "http://localhost:5000/api/specialmenu"
        : "http://localhost:5000/api/menu";

      await axios.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

      alert("Menu item added successfully!");
      navigate("/admin/addmenutable", { replace: true });
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item: " + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Add Menu Item</h2>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Name" className="w-full p-2 border rounded-md" required />
          <input type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded-md" required />
          <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded-md" required />
          <select value={itemCategory} onChange={(e) => setItemCategory(e.target.value)} className="w-full p-2 border rounded-md" required>
            <option value="Appetizers">Appetizers</option>
            <option value="Main Dishes">Main Dishes</option>
            <option value="Desserts">Desserts</option>
            <option value="Beverages">Beverages</option>
          </select>

          <label className="flex items-center">
            <input type="checkbox" checked={isSpecial} onChange={(e) => setIsSpecial(e.target.checked)} className="mr-2" />
            Mark as Special Menu
          </label>

          {isSpecial && (
            <DatePicker selected={specialDay} onChange={setSpecialDay} filterDate={filterDate} className="w-full p-2 border rounded-md" placeholderText="Select Special Day" />
          )}

          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" required />

          <label className="flex items-center">
            <input type="checkbox" checked={itemAvailability} onChange={(e) => setItemAvailability(e.target.checked)} className="mr-2" />
            Available
          </label>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Add Item</button>
        </form>
      </div>
    </div>
  );
}

export default Menu;
