import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reservation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    people: "",
    specialRequest: "",
    table_category: "Normal",
  });

  const [reservationsOpen, setReservationsOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.email) {
      alert("You must be logged in to make a reservation.");
      navigate("/login");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || ""
    }));

    const fetchReservationStatus = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/config/reservation-status");
        setReservationsOpen(res.data.reservationsOpen);
      } catch (error) {
        console.error("Error fetching reservation status", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reservationsOpen) {
      alert("All tables are booked at the moment!");
      return;
    }

    // ✅ Validate phone number (Sri Lankan format: 10 digits, starts with 0)
const phoneRegex = /^0\d{9}$/;
if (!phoneRegex.test(formData.phone)) {
  alert("Please enter a valid Sri Lankan phone number (e.g., 0771234567).");
  return;
}

    // ✅ Validate number of people
    const peopleCount = parseInt(formData.people);
    if (isNaN(peopleCount) || peopleCount <= 0) {
      alert("Please enter a valid number of people.");
      return;
    }

    // ✅ Combine and validate date & time
    const reservationDateTime = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (reservationDateTime <= now) {
      alert("Please select a future date and time.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/reservations", formData);
      alert("Reservation created! Check your email for confirmation.");
      setFormData({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
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

  // ✅ Today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split("T")[0];

  if (loading) {
    return <div className="text-center p-8">Checking reservation availability...</div>;
  }

  if (!reservationsOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">All Tables are Booked!</h2>
          <p className="text-lg text-gray-700">We are currently not accepting new reservations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reserve Your Table</h2>

        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-md" />
        <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-md" />
        <input type="email" name="email" placeholder="Email Address" value={formData.email} readOnly className="w-full p-3 mb-4 border rounded-md bg-gray-100 cursor-not-allowed" />
        <input type="date" name="date" value={formData.date} onChange={handleChange} required min={todayDate} className="w-full p-3 mb-4 border rounded-md" />
        <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-md" />
        <input type="number" name="people" min="1" placeholder="Number of People" value={formData.people} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-md" />
        <select name="table_category" value={formData.table_category} onChange={handleChange} required className="w-full p-3 mb-4 border rounded-md">
          <option value="Normal">Normal Table</option>
          <option value="VIP">VIP Table</option>
        </select>
        <textarea name="specialRequest" placeholder="Special Requests (optional)" value={formData.specialRequest} onChange={handleChange} className="w-full p-3 mb-6 border rounded-md" />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-md transition">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Reservation;
