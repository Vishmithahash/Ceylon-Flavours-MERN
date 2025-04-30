import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-100 px-4 md:px-12 py-10">
      {/* Navigation Buttons */}
      <div className="flex justify-center gap-6 mb-8">
        <button
          onClick={() => navigate("/order-status")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Orders
        </button>
        <button
          onClick={() => navigate("/my-reservations")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Reservations
        </button>
        <button
          onClick={() => navigate("/delivery")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Deliveries
        </button>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">My Reservations</h2>

      <div className="max-w-3xl mx-auto space-y-4">
        {reservations.length > 0 ? (
          reservations.map((res) => (
            <div key={res._id} className="bg-white border p-4 rounded shadow">
              <p><strong>Date:</strong> {res.date}</p>
              <p><strong>Time:</strong> {res.time}</p>
              <p><strong>Guests:</strong> {res.people}</p>
              <p><strong>Table Category:</strong> {res.table_category}</p>
              <p><strong>Special Request:</strong> {res.specialRequest || "None"}</p>
              {isUpcoming(res.date, res.time) ? (
                <button
                  onClick={() => handleCancel(res._id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
                >
                  Cancel Reservation
                </button>
              ) : (
                <p className="text-green-600 font-semibold mt-3">Already Completed</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default UserReservations;
