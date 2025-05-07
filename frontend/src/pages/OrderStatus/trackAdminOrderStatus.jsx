import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

function TrackAdminOrderStatus() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  const orderType = order?.orderType?.toLowerCase();
  const isPickup = orderType === "pick up";

  const stages = [
    "Order Placed",
    "Order Confirmed",
    "Order is Being Prepared",
    "Order Preparation Completed",
    isPickup ? "Ready to Pick Up" : "Order Handover to Delivery"
  ];

  const [currentStage, setCurrentStage] = useState(order?.trackingStatus || stages[0]);
  const [completedStages, setCompletedStages] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(order?.status === "Confirmed");

  useEffect(() => {
    if (order?.trackingStatus) {
      const index = stages.indexOf(order.trackingStatus);
      setCurrentStage(order.trackingStatus);
      setCompletedStages(stages.slice(0, index));
    } else {
      setCurrentStage(stages[0]);
      setCompletedStages([]);
    }
    setIsConfirmed(order?.status === "Confirmed");
  }, [order]);

  const updateTrackingStatus = async (newStatus, index) => {
    const currentIndex = stages.indexOf(currentStage);

    if (!isConfirmed) {
      alert("⚠️ Please confirm the order first in Admin Order panel.");
      return;
    }

    if (index < currentIndex) {
      alert("❌ Cannot go back to a previous stage.");
      return;
    }

    if (index > currentIndex + 1) {
      alert("⚠️ Please complete previous steps first.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${order._id}`,
        { trackingStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCurrentStage(newStatus);
      setCompletedStages(stages.slice(0, index));
      alert("✅ Tracking status updated to: " + newStatus);
    } catch (err) {
      console.error("❌ Failed to update tracking status", err);
      alert("❌ Failed to update tracking status");
    }
  };

  return (
    <div>
      <AdminHeader />
      <div className="max-w-4xl mx-auto mt-10 px-6 py-8 bg-white shadow rounded-xl border">
        <button
          onClick={() => navigate("/admin/admin-orders")}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow"
        >
          ← Back to Orders
        </button>

        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-800">
          📅 Order Status Tracker
        </h2>

        {!isConfirmed && (
          <div className="mb-6 text-center text-red-600 font-semibold">
            ⚠️ You must confirm the order before updating tracking status.
          </div>
        )}

        <div className="flex flex-col gap-6">
          {stages.map((stage, index) => {
            const isCurrent = stage === currentStage;
            const isCompleted = completedStages.includes(stage);
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md transition-all border ${
                  isCurrent
                    ? "bg-yellow-100 border-yellow-400"
                    : isCompleted
                    ? "bg-green-100 border-green-400"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                <span className="text-lg font-medium text-gray-800">{stage}</span>
                <button
                  onClick={() => updateTrackingStatus(stage, index)}
                  className={`text-sm px-4 py-2 rounded-md font-semibold shadow-md transition duration-200 ${
                    isCurrent
                      ? "bg-yellow-500 text-white cursor-default"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  disabled={!isConfirmed || isCurrent}
                >

                  {isCurrent ? "Current Stage" : "Set as Current"}
                </button>


              </div>


            );
          })}

          
        </div>
      </div>
    </div>
  );
}

export default TrackAdminOrderStatus;
