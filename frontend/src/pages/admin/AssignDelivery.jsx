import React, { useEffect, useState } from "react";
import axios from "axios";

function AssignDelivery() {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const API_ORDER = "http://localhost:5000/api/order"; // already implemented by your team
  const API_DELIVERY = "http://localhost:5000/api/delivery";
  const API_ASSIGN = "http://localhost:5000/api/delivery-assignment/assign";

  // ✅ Fetch only confirmed orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(API_ORDER);
        const confirmedOrders = res.data.filter((order) => order.status === "Confirmed");
        setOrders(confirmedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Fetch only available delivery personnel
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const res = await axios.get(API_DELIVERY);
        const available = res.data.filter((person) => person.Status === "Available");
        setDeliveryPersons(available);
      } catch (err) {
        console.error("Error fetching delivery personnel:", err);
      }
    };
    fetchPersons();
  }, []);

  const handleAssign = async () => {
    if (!selectedOrder || !selectedPerson || !estimatedTime) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(API_ASSIGN, {
        orderId: selectedOrder,
        deliveryPersonId: selectedPerson,
        estimatedTime,
      });
      alert("Delivery Assigned!");
      // Reset
      setSelectedOrder("");
      setSelectedPerson("");
      setEstimatedTime("");
    } catch (err) {
      alert("Error assigning delivery");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Assign Delivery</h1>

      <div className="mb-4">
        <label className="block font-semibold">Select Confirmed Order:</label>
        <select
          value={selectedOrder}
          onChange={(e) => setSelectedOrder(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Order --</option>
          {orders.map((order) => (
            <option key={order._id} value={order._id}>
              {order._id} - {order.customerName || "Unnamed Customer"}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Assign to Available Delivery Person:</label>
        <select
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="">-- Select Person --</option>
          {deliveryPersons.map((person) => (
            <option key={person._id} value={person._id}>
              {person.DeliveryPersonName} ({person.VehicleNo})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Estimated Arrival Time:</label>
        <input
          type="text"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          placeholder="e.g. 45 mins or 12:30 PM"
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleAssign}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Assign Delivery
      </button>
    </div>
  );
}

export default AssignDelivery;
