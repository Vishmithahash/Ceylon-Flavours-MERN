import React, { useState } from "react";
import AssignDelivery from "./AssignDelivery";
import ManageDeliveryPersonnel from "./ManageDeliveryPersonnel";

const Deliveries = () => {
  const [activeTab, setActiveTab] = useState("assign");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">Delivery Management</h1>

        <div className="flex space-x-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab("assign")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "assign" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Assign Delivery
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "manage" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Manage Delivery Personnel
          </button>
        </div>

        {activeTab === "assign" && <AssignDelivery />}
        {activeTab === "manage" && <ManageDeliveryPersonnel />}
      </div>
    </div>
  );
};

export default Deliveries;
