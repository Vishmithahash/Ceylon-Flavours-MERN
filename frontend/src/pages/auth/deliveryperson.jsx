import React from "react";
import { useNavigate } from "react-router-dom";

function DeliveryPersonPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("🚪 Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen relative bg-green-100 flex flex-col justify-center items-center">
      {/* Logout button in top-right */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>

      {/* Welcome text */}
      <h1 className="text-3xl font-bold text-green-700 text-center">
        Welcome, Delivery Person!
      </h1>
    </div>
  );
}

export default DeliveryPersonPage;
