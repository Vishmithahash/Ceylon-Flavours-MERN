import React, { useState } from "react";
import axios from "axios";

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    people: "",
    specialRequest: "",
    table_category: "Normal", // <-- Default Normal
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/reservations", formData);
      alert("Reservation created! Check your email for confirmation.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        people: "",
        specialRequest: "",
        table_category: "Normal",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create reservation");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reserve Your Table</h2>

        <input 
          type="text" 
          name="name" 
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
          type="tel" 
          name="phone" 
          placeholder="Phone Number" 
          value={formData.phone}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
          type="email" 
          name="email" 
          placeholder="Email Address" 
          value={formData.email} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
          type="date" 
          name="date" 
          value={formData.date} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
          type="time" 
          name="time" 
          value={formData.time} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input 
          type="number" 
          name="people" 
          placeholder="Number of People" 
          value={formData.people} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* NEW: Table Category Dropdown */}
        <select 
          name="table_category" 
          value={formData.table_category} 
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="Normal">Normal Table</option>
          <option value="VIP">VIP Table</option>
        </select>

        <textarea 
          name="specialRequest" 
          placeholder="Special Requests (optional)" 
          value={formData.specialRequest} 
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button 
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition duration-300"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Reservation;
