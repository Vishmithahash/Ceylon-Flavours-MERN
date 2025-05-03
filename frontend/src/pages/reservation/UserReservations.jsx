import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUsers, FaChair } from "react-icons/fa";

const UserReservations = () => {
  const { user } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  const handleCancel = async (id) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this reservation?");
    if (!confirmCancel) return;

    try {
      await axios.delete(`http://localhost:5000/api/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      alert("Reservation cancelled.");
    } catch (error) {
      console.error("Cancellation failed", error);
    }
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/reservations/user/${user.email}`);
        setReservations(res.data);
      } catch (error) {
        console.error("Error loading reservations", error);
      }
    };

    if (user?.email) fetchReservations();
  }, [user]);

  const isUpcoming = (date, time) => {
    const now = new Date();
    const resDate = new Date(`${date}T${time}`);
    return resDate > now;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-6 py-10">
      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8">
        {["/order-status", "/my-reservations", "/delivery"].map((path, idx) => (
          <button
            key={idx}
            onClick={() => navigate(path)}
            className={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition ${
              path === "/my-reservations"
                ? "bg-indigo-700"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {path === "/order-status" && "Orders"}
            {path === "/my-reservations" && "Reservations"}
            {path === "/delivery" && "Deliveries"}
          </button>
        ))}
      </div>

      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">My Reservations</h2>

      <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <div
              key={res._id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="space-y-2 text-gray-800">
                <p className="flex items-center gap-2 text-lg font-medium">
                  <FaCalendarAlt className="text-indigo-600" /> {res.date}
                </p>
                <p className="flex items-center gap-2">
                  <FaClock className="text-indigo-600" /> {res.time}
                </p>
                <p className="flex items-center gap-2">
                  <FaUsers className="text-indigo-600" /> {res.people} Guest(s)
                </p>
                <p className="flex items-center gap-2">
                  <FaChair className="text-indigo-600" /> {res.table_category} Table
                </p>
                {res.specialRequest && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Special Request:</strong> {res.specialRequest}
                  </p>
                )}
              </div>

              {isUpcoming(res.date, res.time) ? (
                <button
                  onClick={() => handleCancel(res._id)}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 rounded-md transition"
                >
                  Cancel Reservation
                </button>
              ) : (
                <p className="mt-4 text-green-600 font-semibold text-center">
                  ✅ Reservation Completed
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="col-span-2 text-center text-gray-500 text-lg">No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default UserReservations;
