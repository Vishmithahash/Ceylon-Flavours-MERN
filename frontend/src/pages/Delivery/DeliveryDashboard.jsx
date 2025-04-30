import React, { useEffect, useState } from "react";
import axios from "axios";

const DeliveryDashboard = () => {
  const [assignments, setAssignments] = useState([]);
  const deliveryPersonId = localStorage.getItem("deliveryPersonId"); // Adjust as needed

  const API_BASE = "http://localhost:5000/api/delivery-assignment/person";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${deliveryPersonId}`);
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      }
    };

    fetchAssignments();
  }, [deliveryPersonId]);

  const handleStatusUpdate = async (id, status, eta) => {
    try {
      await axios.patch(`http://localhost:5000/api/delivery-assignment/status/${id}`, {
        status,
        estimatedTime: eta
      });
      alert("Status updated");
      window.location.reload();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleUploadEBill = async (id) => {
    const eBillUrl = prompt("Paste the e-bill URL (e.g., PDF/image):");
    if (!eBillUrl) return;

    try {
      await axios.post(`http://localhost:5000/api/delivery-assignment/upload-ebill/${id}`, {
        eBillUrl,
      });
      alert("E-Bill uploaded");
      window.location.reload();
    } catch (err) {
      console.error("Failed to upload e-bill", err);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6 text-center">My Deliveries</h1>

        {assignments.length === 0 ? (
          <p className="text-center text-gray-600">No assignments found.</p>
        ) : (
          assignments.map((a) => (
            <div key={a._id} className="border rounded p-4 mb-4 shadow">
              <h2 className="text-lg font-semibold mb-2">Order ID: {a.orderId?._id}</h2>
              <p><strong>Customer:</strong> {a.orderId?.customerName || "N/A"}</p>
              <p><strong>Address:</strong> {a.orderId?.address || "N/A"}</p>
              <p><strong>Current Status:</strong> {a.status}</p>
              <p><strong>Estimated Arrival:</strong> {a.estimatedTime || "Not set"}</p>
              {a.eBillUrl && (
                <p className="mt-2">
                  <strong>E-Bill:</strong>{" "}
                  <a href={a.eBillUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    View
                  </a>
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  className="bg-yellow-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    const eta = prompt("Enter ETA (e.g., 45 mins):");
                    if (eta) handleStatusUpdate(a._id, "Picked Up", eta);
                  }}
                >
                  Picked Up
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                  onClick={() => {
                    const eta = prompt("Update ETA:");
                    if (eta) handleStatusUpdate(a._id, "On the Way", eta);
                  }}
                >
                  On the Way
                </button>
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded"
                  onClick={() => handleStatusUpdate(a._id, "Delivered", a.estimatedTime)}
                >
                  Mark Delivered
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-1 rounded"
                  onClick={() => handleUploadEBill(a._id)}
                >
                  Upload E-Bill
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeliveryDashboard;
