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

    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid Sri Lankan phone number (e.g., 0771234567).");
      return;
    }

    const peopleCount = parseInt(formData.people);
    if (isNaN(peopleCount) || peopleCount <= 0 || peopleCount > 10) {
      alert("Maximum number of people can be 10 per Reservation.");
      return;
    }

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

  const todayDate = new Date().toISOString().split("T")[0];

  if (loading) {
    return <div className="text-center p-10 text-lg font-medium">Checking reservation availability...</div>;
  }

  if (!reservationsOpen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-purple-200">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
          <h2 className="text-3xl font-bold text-red-600 mb-4">All Tables are Booked!</h2>
          <p className="text-gray-700 text-lg">We are currently not accepting new reservations. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 via-purple-100 to-pink-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Reserve Your Table</h2>

        <div className="space-y-4">
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400" />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} readOnly className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-md cursor-not-allowed" />
          <div className="flex space-x-4">
            <input type="date" name="date" value={formData.date} onChange={handleChange} required min={todayDate} className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400" />
            <input type="time" name="time" value={formData.time} onChange={handleChange} required className="w-1/2 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400" />
          </div>
          <input type="number" name="people" min="1" placeholder="Number of People" value={formData.people} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400" />
          <select name="table_category" value={formData.table_category} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400">
            <option value="Normal">Normal Table</option>
            <option value="VIP">VIP Table</option>
          </select>
          <textarea name="specialRequest" placeholder="Special Requests (optional)" value={formData.specialRequest} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 resize-none" rows="3" />
        </div>

        <button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out shadow-md">
          Book Now
        </button>
      </form>
    </div>
  );
};

export default Reservation;
