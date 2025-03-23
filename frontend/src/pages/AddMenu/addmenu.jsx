import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddMenu() {
  // State variables to manage menu items and search/filter functionality
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [daysToNextSpecial, setDaysToNextSpecial] = useState(null); // State to store days until the next special menu

  const navigate = useNavigate();

  // Fetch menu items from the server
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        console.log("Fetched menu items:", response.data);

        if (response.data && Array.isArray(response.data)) {
          setMenuItems(response.data);
          setFilteredItems(response.data);
          calculateDaysToNextSpecial(response.data); // Calculate days to next special menu
        } else if (response.data && Array.isArray(response.data.menu)) {
          setMenuItems(response.data.menu);
          setFilteredItems(response.data.menu);
          calculateDaysToNextSpecial(response.data.menu); // Calculate days to next special menu
        } else {
          console.error("Invalid data format: Expected an array");
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

  // Calculate the number of days until the next special menu
  const calculateDaysToNextSpecial = (items) => {
    const currentDate = new Date();
    let minDays = Infinity;

    items.forEach((item) => {
      if (item.isSpecial && item.specialDay) {
        const specialDate = new Date(item.specialDay);
        const timeDiff = specialDate - currentDate;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff >= 0 && daysDiff < minDays) {
          minDays = daysDiff;
        }
      }
    });

    setDaysToNextSpecial(minDays === Infinity ? null : minDays);
  };

  // Handle search input
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    filterItems(event.target.value, selectedCategory);
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterItems(searchQuery, category);
  };

  // Filter items based on search query and category
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
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/menu4.jpeg')` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative p-8">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">
          Welcome to Ceylon Flavors!
        </h1>

        {/* Days to next special menu */}
        {daysToNextSpecial !== null && (
          <p className="text-white text-center mb-4">
            Next Special Menu in <span className="font-bold">{daysToNextSpecial}</span> days!
          </p>
        )}

        {/* Search Bar */}
        <div className="text-center mb-6">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Category Buttons */}
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

        {/* Menu Items Grid */}
        {Array.isArray(filteredItems) && filteredItems.length === 0 ? (
          <p className="text-gray-600 text-center">No menu items available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredItems) &&
              filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow text-center"
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
                  <button
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Admin Side Button */}
        <button
          onClick={() => navigate("/menutable", { replace: true })}
          className="fixed top-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Admin Side
        </button>
      </div>
    </div>
  );
}

export default AddMenu;
