import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function AddMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [daysToNextSpecial, setDaysToNextSpecial] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [showSpecialMenuPage, setShowSpecialMenuPage] = useState(false);
  const [isTodaySpecial, setIsTodaySpecial] = useState(false);
  const [countdown, setCountdown] = useState({});

  const specialDays = ["02-14", "04-14", "12-25", "12-31"];

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/menu");
        if (response.data && Array.isArray(response.data)) {
          setMenuItems(response.data);
          setFilteredItems(response.data);
          calculateDaysToNextSpecial(response.data);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };
    fetchMenuItems();
  }, []);

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

  const checkSpecialDay = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${month}-${day}`;
    return specialDays.includes(todayStr) || today.getDay() === 0 || today.getDay() === 6;
  };

  const handleSpecialMenuClick = () => {
    const todayIsSpecial = checkSpecialDay();
    setIsTodaySpecial(todayIsSpecial);
    setShowSpecialMenuPage(true);
    if (!todayIsSpecial) {
      startCountdown();
    }
  };

  const startCountdown = () => {
  const now = new Date();

  // Find next Saturday
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + (6 - now.getDay() + (now.getDay() >= 6 ? 7 : 0)));

  // Find next Sunday
  const nextSunday = new Date(now);
  nextSunday.setDate(now.getDate() + (7 - now.getDay() + (now.getDay() >= 0 ? 7 : 0)));

  // Find next fixed special day
  let nextSpecialDay = null;
  specialDays.forEach(dateStr => {
    const [month, day] = dateStr.split("-");
    const specialDate = new Date(now.getFullYear(), parseInt(month) - 1, parseInt(day));
    if (specialDate >= now && (!nextSpecialDay || specialDate < nextSpecialDay)) {
      nextSpecialDay = specialDate;
    }
  });

  // If no fixed special day left, take first of next year
  if (!nextSpecialDay) {
    const [month, day] = specialDays[0].split("-");
    nextSpecialDay = new Date(now.getFullYear() + 1, parseInt(month) - 1, parseInt(day));
  }

  // Pick the closest date (Saturday/Sunday/Fixed Special Day)
  const candidates = [nextSaturday, nextSunday, nextSpecialDay];
  const nextClosest = candidates.reduce((closest, candidate) => {
    return candidate - now < closest - now ? candidate : closest;
  }, candidates[0]);

  // Update countdown every second
  const updateCountdown = () => {
    const now = new Date();
    const diff = nextClosest - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdown({ days, hours, minutes, seconds });
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
};


  return (
    <div className="min-h-screen bg-cover bg-center relative" style={{ backgroundImage: `url('/menu4.jpeg')` }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative p-8">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Welcome to Ceylon Flavors!</h1>

        <div className="text-center mb-6">
          <button onClick={handleSpecialMenuClick} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Go to Special Menu
          </button>
        </div>

        {daysToNextSpecial !== null && (
          <p className="text-white text-center mb-4">
            Next Special Menu in <span className="font-bold">{daysToNextSpecial}</span> days!
          </p>
        )}

        {!showSpecialMenuPage ? (
          <>
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
              {['Appetizers', 'Main Dishes', 'Desserts', 'Beverages', 'All'].map((category) => (
                <button
                  key={category}
                  className={`m-1 px-4 py-2 text-white rounded-lg ${selectedCategory === category ? 'bg-blue-700' : 'bg-blue-500'} hover:bg-blue-600`}
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
                {filteredItems.map((item) => (
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
                    {item.isSpecial ? (
                      <div>
                        <p className="text-gray-600 line-through">Price: Rs.{item.price}.00</p>
                        <p className="text-red-600 font-semibold">Discounted: Rs.{(item.price * 0.8).toFixed(2)}</p>
                        <p className="text-green-600 font-medium">20% discount for today only!</p>
                      </div>
                    ) : (
                      <p className="text-gray-700 font-semibold">Price: Rs.{item.price}.00</p>
                    )}
                    <p className={`mt-2 text-sm font-medium ${item.availability ? 'text-green-600' : 'text-red-600'}`}>
                      {item.availability ? 'Available' : 'Unavailable'}
                    </p>
                    <button
                      onClick={() => addToCart(item)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate("/menutable", { replace: true })}
              className="fixed top-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Admin Side
            </button>
          </>
        ) : (
          <div className="text-center text-white">
            {isTodaySpecial ? (
              <>
                <h2 className="text-3xl font-bold mb-6">Today's Special Menu 🍽️</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.filter(item => item.isSpecial).map(item => (
                    <div key={item._id} className="bg-yellow-300 p-6 rounded-lg shadow-lg">
                      <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-full h-48 object-cover rounded-md mb-4" />
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <p>{item.description}</p>
                      <p>Price: Rs.{(item.price * 0.8).toFixed(2)} (20% OFF!)</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold mb-6">Countdown to Next Special Menu 🎉</h2>
                <p className="text-2xl">
                  {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddMenu;
