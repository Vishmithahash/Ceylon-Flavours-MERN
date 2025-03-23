import React, { useState, useEffect } from "react";
import axios from "axios";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ name: "", age: "", subject: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reservation");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/reservation/update/${editingId}`, formData);
        alert("Reservation updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/reservation/create", formData);
        alert("Reservation Created successfully");
      }
      setFormData({ name: "", age: "", subject: "" });
      setEditingId(null);
      fetchReservations();
    } catch (error) {
      console.error("Error submitting reservation:", error);
    }
  };

  const handleEdit = (reservation) => {
    setFormData({ name: reservation.name, age: reservation.age, subject: reservation.subject });
    setEditingId(reservation._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservation/delete/${id}`);
      alert("Reservation deleted successfully");
      fetchReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Reservations</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? "Update" : "Create"} Reservation
        </button>
      </form>

      <div className="mt-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Age</th>
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id} className="text-center">
                <td className="border border-gray-300 p-2">{res.name}</td>
                <td className="border border-gray-300 p-2">{res.age}</td>
                <td className="border border-gray-300 p-2">{res.subject}</td>
                <td className="border border-gray-300 p-2">
                  <button onClick={() => handleEdit(res)} className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(res._id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reservation;
