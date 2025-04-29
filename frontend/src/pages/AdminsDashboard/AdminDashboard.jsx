import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admins/Staff</h1>
          <nav className="space-x-6">
            <button onClick={() => navigate("/admin/dashboard")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Dashboard
            </button>
            <button onClick={() => navigate("/admin/orders")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Orders
            </button>
            <button onClick={() => navigate("/admin/deliveries")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Deliveries
            </button>
            <button onClick={() => navigate("/reservation-list")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Reservations
            </button>
            <button onClick={() => navigate("/admin/reviews")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Reviews
            </button>
            <button onClick={() => navigate("/admin/inventory")} className="text-gray-600 hover:text-blue-500 font-semibold">
              Inventory
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6">
        <div className="text-center text-gray-700 text-xl font-semibold">
          Welcome, Admin! Select a section from above to manage the system.
        </div>
      </main>

    </div>
  );
};

export default AdminDashboard;
