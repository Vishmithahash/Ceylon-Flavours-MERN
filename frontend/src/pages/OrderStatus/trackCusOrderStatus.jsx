import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function TrackCusOrderStatus() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;
  const [trackingStatus, setTrackingStatus] = useState(order?.trackingStatus || "Order Placed");

  const orderType = order?.orderType?.toLowerCase();
  const isPickup = orderType === "pick up";

  const steps = [
    "Order Placed",
    "Order Confirmed",
    "Order is Being Prepared",
    "Order Preparation Completed",
    isPickup ? "Ready to Pick Up" : "Order Handover to Delivery"
  ];

  useEffect(() => {
    if (!order?._id) return;

    const fetchUpdatedOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrackingStatus(res.data.trackingStatus || "Order Placed");
      } catch (err) {
        console.error("Failed to fetch order tracking:", err);
      }
    };

    const interval = setInterval(fetchUpdatedOrder, 5000);
    return () => clearInterval(interval);
  }, [order?._id]);

  const getStepStatus = (step) => {
    const currentIndex = steps.indexOf(trackingStatus);
    const stepIndex = steps.indexOf(step);
    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "pending";
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/order-status")}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded shadow text-sm font-semibold text-gray-700 transition"
        >
          ← Back to My Orders
        </button>
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-8 flex justify-center items-center gap-2">
        📍 Track Your Order
      </h1>

      {/* Steps Timeline */}
      <div className="flex justify-between items-start px-4 mb-12 gap-4 sm:gap-6 md:gap-10">
  {steps.map((step, idx) => {
    const status = getStepStatus(step);
    const circleStyle = {
      base: "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold",
      current: "bg-yellow-500",
      completed: "bg-green-500",
      pending: "bg-gray-300"
    };

    const textStyle = {
      base: "mt-2 w-24 text-xs sm:text-sm text-center font-medium leading-tight",
      current: "text-yellow-600",
      completed: "text-green-600",
      pending: "text-gray-500"
    };

    return (
      <div key={idx} className="flex flex-col items-center flex-1 min-w-[90px]">
        <div className={`${circleStyle.base} ${circleStyle[status]}`}>{idx + 1}</div>
        <p className={`${textStyle.base} ${textStyle[status]}`}>{step}</p>
      </div>
    );
  })}
</div>


      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-lg border border-blue-200 p-8 mt-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center gap-2">
          🧾 Order Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Order ID</span>
            <span className="text-sm font-medium text-gray-700 break-all">{order._id}</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Current Status</span>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-600 shadow-sm">
              {trackingStatus}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm text-gray-500 mb-1">Total Payment</span>
            <span className="text-lg font-bold text-green-600">Rs. {order.total}.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackCusOrderStatus;
