import React, { useEffect, useState } from "react";
import axios from "axios";

function MenuTable() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

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
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = menuItems.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleUpdate = (id) => {
    console.log("Update item with ID:", id);
    // Add your update logic here
  };

  const handleDelete = (id) => {
    console.log("Delete item with ID:", id);
    // Add your delete logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Menu Management
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
    <th className="py-3 px-6 text-center">Actions</th>
  </tr>
</thead>
<tbody>
  {Array.isArray(filteredItems) && filteredItems.map((item) => (
    <tr key={item.id} className="border-t">
      <td className="py-4 px-6 text-center">
        <img
          src={`http://localhost:5000/uploads/${item.image}`}
          alt={item.name}
          className="w-20 h-20 object-cover rounded-md mx-auto"
        />
      </td>
      <td className="py-4 px-6 text-center">{item.name}</td>
      <td className="py-4 px-6 text-center">{item.description}</td>
      <td className="py-4 px-6 text-center">${item.price}</td>
      <td className="py-4 px-6 text-center">
        <span className={`text-sm font-medium ${
          item.availability ? "text-green-600" : "text-red-600"
        }`}>
          {item.availability ? "Available" : "Unavailable"}
        </span>
      </td>
      <td className="py-4 px-6 text-center">
        <button
          onClick={() => handleUpdate(item.id)}
          className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Update
        </button>
        <button
          onClick={() => handleDelete(item.id)}
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
    </div>
  );
}

export default MenuTable;
