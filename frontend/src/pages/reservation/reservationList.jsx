import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reservation");
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservation/delete/${id}`);
      alert("Reservation deleted");
      fetchReservations();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const handleEdit = (reservation) => {
    setEditingId(reservation._id);
    setEditData({ ...reservation });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/reservation/update/${editingId}`, editData);
      alert("Reservation updated");
      setEditingId(null);
      fetchReservations();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  const filteredReservations = reservations.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filter === "All" || res.table_category === filter;
    return matchesSearch && matchesCategory;
  });

  return (

    
    <div className="p-6 text-black">
      <h2 className="text-2xl font-semibold mb-4">Reservation List</h2>

      

      <div className="mb-4">
        <label className="mr-2">Filter by Category</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2">
          <option value="All">All</option>
          <option value="VIP">VIP</option>
          <option value="Normal">Normal</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="mr-2">Search by Name</label>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 w-96"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Guests</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Notes</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((res) => (
              <tr key={res._id}>
                {editingId === res._id ? (
                  <>
                    <td><input name="name" value={editData.name} onChange={handleEditChange} /></td>
                    <td><input name="email" value={editData.email} onChange={handleEditChange} /></td>
                    <td><input name="phone" value={editData.phone} onChange={handleEditChange} /></td>
                    <td><input name="date" type="date" value={editData.date} onChange={handleEditChange} /></td>
                    <td><input name="time" type="time" value={editData.time} onChange={handleEditChange} /></td>
                    <td><input name="no_of_guests" value={editData.no_of_guests} onChange={handleEditChange} /></td>
                    <td>
                      <select name="table_category" value={editData.table_category} onChange={handleEditChange}>
                        <option value="Normal">Normal</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </td>
                    <td><input name="notes" value={editData.notes} onChange={handleEditChange} /></td>
                    <td>
                      <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 mr-1 rounded">Save</button>
                      <button onClick={() => setEditingId(null)} className="bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border p-2">{res.name}</td>
                    <td className="border p-2">{res.email}</td>
                    <td className="border p-2">{res.phone}</td>
                    <td className="border p-2">{res.date}</td>
                    <td className="border p-2">{res.time}</td>
                    <td className="border p-2">{res.no_of_guests}</td>
                    <td className="border p-2">{res.table_category}</td>
                    <td className="border p-2">{res.notes}</td>
                    <td className="border p-2">
                      <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-2 py-1 mr-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(res._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationList;
