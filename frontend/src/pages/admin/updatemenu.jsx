import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function UpdateMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemImage, setItemImage] = useState(null);
  const [itemAvailability, setItemAvailability] = useState(true);
  const [itemCategory, setItemCategory] = useState("Appetizers");
  const [isSpecial, setIsSpecial] = useState(false);
  const [specialDay, setSpecialDay] = useState(null);
  const [createdAt, setCreatedAt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isFromSpecialMenu, setIsFromSpecialMenu] = useState(false);

  const allowedSpecialDates = ["02-14", "04-14", "12-25", "12-31"];
  const filterDate = (date) => {
    const formatted = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return date.getDay() === 0 || date.getDay() === 6 || allowedSpecialDates.includes(formatted);
  };

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const normalRes = await axios.get(`http://localhost:5000/api/menu/${id}`);
        populateFields(normalRes.data);
        setIsFromSpecialMenu(false);
      } catch {
        try {
          const specialRes = await axios.get(`http://localhost:5000/api/specialmenu/${id}`);
          populateFields(specialRes.data);
          setIsFromSpecialMenu(true);
        } catch {
          setErrorMessage("Menu item not found.");
        }
      }
    };

    const populateFields = (data) => {
      setItemName(data.name);
      setItemDescription(data.description);
      setItemPrice(data.price);
      setItemAvailability(data.availability);
      setItemCategory(data.category || "Appetizers");
      setIsSpecial(data.isSpecial || false);
      setSpecialDay(data.specialDay ? new Date(data.specialDay) : null);
      setCreatedAt(data.createdAt);
    };

    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (parseFloat(itemPrice) < 0) {
      setErrorMessage("Price cannot be negative.");
      return;
    }
  
    if (isSpecial && !specialDay) {
      setErrorMessage("Please select a valid special day.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("name", itemName);
      formData.append("description", itemDescription);
      formData.append("price", itemPrice);
      formData.append("availability", itemAvailability.toString());
      formData.append("category", itemCategory);
      formData.append("isSpecial", isSpecial.toString());
      formData.append("specialDay", isSpecial && specialDay ? specialDay.toISOString() : "");
  
      if (itemImage) {
        formData.append("image", itemImage);
      }
  
      // Debug log
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
  
      let response;
  
      // Normal ➝ Special
      if (!isFromSpecialMenu && isSpecial) {
        response = await axios.post("http://localhost:5000/api/specialmenu", formData);
        if (response.status === 201) {
          await axios.delete(`http://localhost:5000/api/menu/${id}`);
        }
  
      // Special ➝ Normal
      } else if (isFromSpecialMenu && !isSpecial) {
        response = await axios.post("http://localhost:5000/api/menu", formData);
        if (response.status === 201) {
          await axios.delete(`http://localhost:5000/api/specialmenu/${id}`);
        }
  
      // Normal ➝ Normal or Special ➝ Special
      } else {
        const endpoint = isFromSpecialMenu
          ? `http://localhost:5000/api/specialmenu/${id}`
          : `http://localhost:5000/api/menu/${id}`;
  
        response = await axios.put(endpoint, formData);
      }
  
      if (response.status === 200 || response.status === 201) {
        alert("Item updated successfully!");
        navigate("/admin/addmenutable", { replace: true });
      } else {
        alert("Failed to update item.");
      }
    } catch (error) {
      console.error("Error updating item:", error.response?.data || error.message);
      alert("An error occurred while updating the item.");
    }
  };
  
  

  const handleImageChange = (e) => setItemImage(e.target.files[0]);
  const formatDate = (date) => new Date(date).toLocaleDateString("en-GB");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Update Menu Item</h2>
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
            <DatePicker
              selected={specialDay}
              onChange={setSpecialDay}
              filterDate={filterDate}
              className="w-full p-2 border rounded-md"
              placeholderText="Select Special Day"
            />
          )}

          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border rounded-md" />
          <label className="flex items-center">
            <input type="checkbox" checked={itemAvailability} onChange={(e) => setItemAvailability(e.target.checked)} className="mr-2" />
            Available
          </label>

          {createdAt && (
            <p className="text-gray-500 text-sm">Item added on: {formatDate(createdAt)}</p>
          )}

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">Update Item</button>
        </form>
      </div>
    </div>
  );
}

export default UpdateMenu;
