import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reservation = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    no_of_guests: "",
    table_category: "Normal",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Validation patterns
  const phonePattern = /^07\d{8}$/;
  const emailPattern = /^[a-z]+[a-z0-9]*@gmail\.com$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    let newErrors = { ...errors };

    if (name === "phone") {
      newErrors.phone = !phonePattern.test(value)
        ? "Must start with '07' and be 10 digits long."
        : "";
    }

    if (name === "email") {
      newErrors.email = !emailPattern.test(value)
        ? "Must be a valid Gmail address (e.g. user@gmail.com)."
        : "";
    }

    if (name === "date") {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      newErrors.date = selectedDate < today ? " Date cannot be in the past." : "";
    }

    if (name === "time" && formData.date) {
      const selectedDateTime = new Date(`${formData.date}T${value}`);
      const now = new Date();
      newErrors.time = selectedDateTime < now ? " Time cannot be in the past." : "";
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validations
    const newErrors = {};

    if (!phonePattern.test(formData.phone)) {
      newErrors.phone = " Must start with '07' and be 10 digits long.";
    }

    if (!emailPattern.test(formData.email)) {
      newErrors.email = " Must be a valid Gmail address (e.g. user@gmail.com).";
    }

    const now = new Date();
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < now) {
      newErrors.date = " Date/time cannot be in the past.";
      newErrors.time = " Date/time cannot be in the past.";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) {
      alert(" Please fix the validation errors before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/reservation/create", formData);
      alert(" Reservation created successfully");

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        no_of_guests: "",
        table_category: "Normal",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };

  return (
    <div
      className="relative w-full min-h-screen bg-black text-white"
      style={{
        backgroundImage: 'url("/pics/anu.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="container mx-auto p-6 relative z-10">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#fffff]">Reserve a Table</h2>

        <div className="bg-[rgba(255,255,255,0.5)] p-6 shadow-md rounded-lg max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded w-full text-black"
              required
            />

            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={`border p-2 rounded w-full text-black ${errors.email ? "border-red-500" : ""}`}
              required
            />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

            <input
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className={`border p-2 rounded w-full text-black ${errors.phone ? "border-red-500" : ""}`}
              required
            />
            {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className={`border p-2 rounded w-full text-black ${errors.date ? "border-red-500" : ""}`}
              required
            />
            {errors.date && <p className="text-red-600 text-sm">{errors.date}</p>}

            <input
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              className={`border p-2 rounded w-full text-black ${errors.time ? "border-red-500" : ""}`}
              required
            />
            {errors.time && <p className="text-red-600 text-sm">{errors.time}</p>}

            <input
              name="no_of_guests"
              type="number"
              value={formData.no_of_guests}
              onChange={handleChange}
              placeholder="Guests"
              className="border p-2 rounded w-full text-black"
              required
            />

            <select
              name="table_category"
              value={formData.table_category}
              onChange={handleChange}
              className="border p-2 rounded w-full text-black"
              required
            >
              <option value="Normal">Normal</option>
              <option value="VIP">VIP</option>
            </select>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Notes"
              className="border p-2 rounded w-full h-24 resize-none text-black"
            />

            <button
              type="submit"
              className="bg-[#403d3d] text-white px-4 py-2 rounded w-full mt-4"
            >
              Create Reservation
            </button>

            
          </form>
        </div>


        <div className="flex justify-center">
        <button
            onClick={() => navigate("/pages/reservation/reservationList")}
            className="bg-red-900 text-white px-4 py-2 rounded w-40 mt-4"
        >
          View All Reservations
        </button>
</div>


      </div>
    </div>
  );
};

export default Reservation;
