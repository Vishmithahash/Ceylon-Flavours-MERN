import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignDelivery() {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState({});
  const [assignedList, setAssignedList] = useState([]);

  const API_ORDERS = "http://localhost:5000/api/orders";
  const API_DELIVERY = "http://localhost:5000/api/delivery";
  const API_ASSIGN = "http://localhost:5000/api/delivery-assignment/assign";

  // Fetch confirmed orders
  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ORDERS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const confirmed = res.data.filter((order) => order.status === "Confirmed");
        setOrders(confirmed);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchConfirmedOrders();
  }, []);

  // Fetch available delivery personnel
  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const res = await axios.get(API_DELIVERY);
        const available = res.data.filter((p) => p.Status === "Available");
        setDeliveryPersons(available);
      } catch (err) {
        console.error("Error fetching personnel", err);
      }
    };
    fetchDeliveryPersons();
  }, []);

  const handleAssignmentChange = (orderId, field, value) => {
    setSelectedAssignments((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleAssign = async (order) => {
    const { personId, estimatedTime } = selectedAssignments[order._id] || {};

    if (!personId || !estimatedTime) {
      alert("Select person and time!");
      return;
    }

    try {
      await axios.post(API_ASSIGN, {
        orderId: order._id,
        deliveryPersonId: personId,
        estimatedTime,
      });

      setAssignedList((prev) => [
        ...prev,
        {
          orderId: order._id,
          customer: `${order.name} (${order.phone})`,
          address: order.address || "N/A",
          items: order.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
          deliveryPerson: deliveryPersons.find((p) => p._id === personId)?.DeliveryPersonName || "",
          estimatedTime,
        },
      ]);

      alert("Assigned!");
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign delivery.");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Assign Delivery</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Contact</th>
              <th className="border px-4 py-2">Address</th>
              <th className="border px-4 py-2">Items</th>
              <th className="border px-4 py-2">Assign To</th>
              <th className="border px-4 py-2">ETA</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="border px-4 py-2">{order._id}</td>
                <td className="border px-4 py-2">{order.name}</td>
                <td className="border px-4 py-2">{order.phone}</td>
                <td className="border px-4 py-2">{order.address || "N/A"}</td>
                <td className="border px-4 py-2">
                  {order.items.map((item, i) => (
                    <div key={i}>{item.name} x{item.quantity}</div>
                  ))}
                </td>
                <td className="border px-4 py-2">
                  <select
                    value={selectedAssignments[order._id]?.personId || ""}
                    onChange={(e) => handleAssignmentChange(order._id, "personId", e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="">-- Select --</option>
                    {deliveryPersons.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.DeliveryPersonName} ({p.VehicleNo})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border px-4 py-2">
                  <input
                    type="text"
                    value={selectedAssignments[order._id]?.estimatedTime || ""}
                    onChange={(e) => handleAssignmentChange(order._id, "estimatedTime", e.target.value)}
                    placeholder="e.g. 45 mins"
                    className="border p-1 rounded w-full"
                  />
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleAssign(order)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No confirmed orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Assigned List Table */}
      {assignedList.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-10 mb-4">Assigned Deliveries</h2>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Order ID</th>
                <th className="border px-4 py-2">Customer</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Items</th>
                <th className="border px-4 py-2">Delivery Person</th>
                <th className="border px-4 py-2">ETA</th>
              </tr>
            </thead>
            <tbody>
              {assignedList.map((d, i) => (
                <tr key={i}>
                  <td className="border px-4 py-2">{d.orderId}</td>
                  <td className="border px-4 py-2">{d.customer}</td>
                  <td className="border px-4 py-2">N/A</td>
                  <td className="border px-4 py-2">{d.address}</td>
                  <td className="border px-4 py-2">{d.items}</td>
                  <td className="border px-4 py-2">{d.deliveryPerson}</td>
                  <td className="border px-4 py-2">{d.estimatedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AssignDelivery;
