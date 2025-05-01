import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [reservationsOpen, setReservationsOpen] = useState(true);

  const navigate = useNavigate();

  const fetchReservations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reservations");
      setReservations(res.data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  const fetchReservationStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/config/reservation-status");
      setReservationsOpen(res.data.reservationsOpen);
    } catch (err) {
      console.error("Error fetching reservation status:", err);
    }
  };

  useEffect(() => {
    fetchReservations();
    fetchReservationStatus();
  }, []);

  const toggleReservationStatus = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/config/toggle-reservation", {
        reservationsOpen: !reservationsOpen,
      });
      setReservationsOpen(res.data.reservationsOpen);
      alert(`Reservations are now ${res.data.reservationsOpen ? "OPEN" : "CLOSED"}`);
    } catch (err) {
      console.error("Error toggling reservation status:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        await axios.delete(`http://localhost:5000/api/reservations/${id}`);
        alert("Reservation deleted");
        fetchReservations();
      } catch (err) {
        console.error("Error deleting:", err);
      }
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
      await axios.put(`http://localhost:5000/api/reservations/${editingId}`, editData);
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
    const matchesDate = !selectedDate || res.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 text-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Reservation List</h2>

          <div className="flex items-center gap-2">
            <span className="font-semibold">Reservations :</span>
            <button
              onClick={toggleReservationStatus}
              className={`px-4 py-2 rounded-md text-white ${reservationsOpen ? "bg-green-500" : "bg-red-500"}`}
            >
              {reservationsOpen ? "OPEN" : "CLOSED"}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          <div>
            <label className="mr-2">Filter by Category:</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded">
              <option value="All">All</option>
              <option value="VIP">VIP</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <div>
            <label className="mr-2">Search by Name:</label>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-64"
            />
          </div>

          <div>
            <label className="mr-2">Filter by Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
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
                <th className="border p-2">Special Request</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res) => (
                <tr key={res._id} className="hover:bg-gray-100">
                  {editingId === res._id ? (
                    <>
                      <td className="border p-2"><input name="name" value={editData.name} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2"><input name="email" value={editData.email} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2"><input name="phone" value={editData.phone} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2"><input name="date" type="date" value={editData.date} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2"><input name="time" type="time" value={editData.time} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2"><input name="people" value={editData.people} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="border p-2">
                        <select name="table_category" value={editData.table_category} onChange={handleEditChange} className="border p-1 w-full">
                          <option value="Normal">Normal</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </td>
                      <td className="border p-2"><input name="specialRequest" value={editData.specialRequest} onChange={handleEditChange} className="border p-1 w-full" /></td>
                      <td className="flex flex-col gap-1 p-2">
                        <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
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
                      <td className="border p-2">{res.people}</td>
                      <td className="border p-2">{res.table_category}</td>
                      <td className="border p-2">{res.specialRequest}</td>
                      <td className="flex flex-col gap-1 p-2">
                        <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
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
    </div>
  );
};

export default ReservationList;