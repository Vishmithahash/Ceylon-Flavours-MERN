import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../../context/CartContext"; // Import Cart Context

function AddMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart } = useCart(); // Get addToCart function from context

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        console.log("Fetched menu items:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setMenuItems(response.data);
          setFilteredItems(response.data);
        } else if (response.data && Array.isArray(response.data.menu)) {
          setMenuItems(response.data.menu);
          setFilteredItems(response.data.menu);
        } else {
          console.error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterItems(event.target.value, selectedCategory);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  };

  const filterItems = (query, category) => {
    let filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category);
    }
    setFilteredItems(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Welcome to Our Restaurant!
      </h1>
      <div className="text-center mb-6">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={handleSearch}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="text-center mb-6">
        {["Appetizers", "Main Dishes", "Desserts", "Beverages", "All"].map((category) => (
          <button
            key={category}
            className={`m-1 px-4 py-2 text-white rounded-lg ${
              selectedCategory === category ? "bg-blue-700" : "bg-blue-500"
            } hover:bg-blue-600`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {Array.isArray(filteredItems) && filteredItems.length === 0 ? (
        <p className="text-gray-600 text-center">No menu items available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(filteredItems) && filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <img
            src={`http://localhost:5000/uploads/${item.image}`}
            alt={item.name}
            className="w-full h-48 object-cover rounded-md mb-4"
             />
              <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-700 font-semibold">Price: Rs.{item.price}.00</p>
              <p
                className={`mt-2 text-sm font-medium ${
                  item.availability ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.availability ? "Available" : "Unavailable"}
              </p>
              <button onClick={() => addToCart(item)} className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              Add to Cart
            </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddMenu;
