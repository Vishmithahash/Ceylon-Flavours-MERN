import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MenuTable() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [daysToNextSpecial, setDaysToNextSpecial] = useState(null); // New state to store days to the next special menu
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
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  // Handle update button click
  const handleUpdate = (id) => {
    console.log("Update item with ID:", id);
    navigate(`/UpdateMenu/${id}`);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/menu/${id}`);
      if (response.status === 200) {
        alert("Item deleted successfully!");
        setMenuItems(menuItems.filter((item) => item._id !== id));
        setFilteredItems(filteredItems.filter((item) => item._id !== id));
      } else {
        alert("Failed to delete item!");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item!");
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
        Menu Management
      </h1>

      {/* Days to next special menu */}
      {daysToNextSpecial !== null && (
        <p className="text-gray-700 text-center mb-4">
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

      {/* Menu Table */}
      {Array.isArray(filteredItems) && filteredItems.length === 0 ? (
        <p className="text-gray-600 text-center">No menu items available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="py-3 px-6 text-center">Image</th>
                <th className="py-3 px-6 text-center">Name</th>
                <th className="py-3 px-6 text-center">Description</th>
                <th className="py-3 px-6 text-center">Price</th>
                <th className="py-3 px-6 text-center">Availability</th>
                <th className="py-3 px-6 text-center">Added Date</th>
                <th className="py-3 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (

                  <tr key={item._id} className="border-t">
                  <td className="py-4 px-6 text-center">
                    <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md mx-auto"
            />
                </td>
                    <td className="py-4 px-6 text-center">{item.name}</td>
                    <td className="py-4 px-6 text-center">{item.description}</td>
                    <td className="py-4 px-6 text-center">Rs.{item.price}.00</td>
                    <td className="py-4 px-6 text-center">
                    <span className={`text-sm font-medium ${item.availability ? "text-green-600" : "text-red-600"}`}>
                    {item.availability ? "Available" : "Unavailable"}
                    </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                    {item.isSpecial ? (
                        <span className="text-blue-600">Special Day Item</span>
                        ) : (
                      <span className="text-gray-600">Regular Item</span>
                        )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Navigation Buttons */}
      <button
        onClick={() => navigate("/menu", { replace: true })}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
        Add New Item
      </button>
      <button
        onClick={() => navigate("/addmenu", { replace: true })}
        className="fixed bottom-8 left-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
        Customer Side
      </button>
    </div>
  );
}

export default MenuTable;
