import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MenuTable() {
  const [normalMenuItems, setNormalMenuItems] = useState([]);
  const [specialMenuItems, setSpecialMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const [normalRes, specialRes] = await Promise.all([
          axios.get("http://localhost:5000/api/menu"),
          axios.get("http://localhost:5000/api/specialmenu")
        ]);

        setNormalMenuItems(normalRes.data);
        setSpecialMenuItems(specialRes.data);
        setServerError(false);
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setServerError(true);
      }
    };

    fetchMenus();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNormalItems = normalMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSpecialItems = specialMenuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdate = (id, isSpecial) => {
    if (isSpecial) {
      navigate(`/UpdateSpecialMenu/${id}`);
    } else {
      navigate(`/UpdateMenu/${id}`);
    }
  };

  const handleDelete = async (id, isSpecial) => {
    try {
      const url = isSpecial
        ? `http://localhost:5000/api/specialmenu/${id}`
        : `http://localhost:5000/api/menu/${id}`;

      await axios.delete(url);

      if (isSpecial) {
        setSpecialMenuItems(specialMenuItems.filter((item) => item._id !== id));
      } else {
        setNormalMenuItems(normalMenuItems.filter((item) => item._id !== id));
      }

      alert("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item!");
    }
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

      {serverError ? (
        <p className="text-red-600 text-center text-xl font-bold">
          Cannot connect to server. Please start backend server.
        </p>
      ) : (
        <>
          {/* Normal Menu Table */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Normal Menu Items
          </h2>
          {filteredNormalItems.length === 0 ? (
            <p className="text-gray-600 text-center mb-10">No normal menu items available.</p>
          ) : (
            <div className="overflow-x-auto mb-10">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-6">Image</th>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Availability</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNormalItems.map((item) => (
                    <tr key={item._id} className="border-t text-center">
                      <td className="py-2">
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>Rs.{item.price}.00</td>
                      <td className={item.availability ? "text-green-600" : "text-red-600"}>
                        {item.availability ? "Available" : "Unavailable"}
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdate(item._id, false)}
                          className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, false)}
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

          {/* Special Menu Table */}
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Special Menu Items
          </h2>
          {filteredSpecialItems.length === 0 ? (
            <p className="text-gray-600 text-center">No special menu items available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-700">
                    <th className="py-3 px-6">Image</th>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Description</th>
                    <th className="py-3 px-6">Price</th>
                    <th className="py-3 px-6">Special Day</th>
                    <th className="py-3 px-6">Availability</th>
                    <th className="py-3 px-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSpecialItems.map((item) => (
                    <tr key={item._id} className="border-t text-center">
                      <td className="py-2">
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>Rs.{item.price}.00</td>
                      <td className="text-blue-600">{item.specialDay}</td>
                      <td className={item.availability ? "text-green-600" : "text-red-600"}>
                        {item.availability ? "Available" : "Unavailable"}
                      </td>
                      <td>
                        <button
                          onClick={() => handleUpdate(item._id, true)}
                          className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, true)}
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
        </>
      )}

      {/* Navigation Buttons */}
      <button
        onClick={() => navigate("/menu", { replace: true })}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
        Add New Item
      </button>
    </div>
  );
}

export default MenuTable;
