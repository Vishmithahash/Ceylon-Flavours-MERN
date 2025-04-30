// pages/AdminOrder/adminOrder.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  //  Fetch Orders from Backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  //  Confirm Order Function
  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: "Confirmed" },
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Confirmed" } : order
        )
      );
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  // Cancel Order Function
  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Send token
      });
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  // Filter and Search function
  const filteredOrders = orders.filter((order) => {
    return (
      (filter === "All" || order.status === filter) &&
      (order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm) ||
        order.customer.email.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-4xl font-bold mb-4">Orders</h1> 
        
        {/* Search & Filter */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-400 rounded-lg"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border border-gray-400 rounded-lg"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-lg">
          <thead>
            <tr className="bg-gray-200 text-xl">
              <th className="p-4 border">Food Details</th>
              <th className="p-4 border">Name</th>
              <th className="p-4 border">Phone Number</th>
              <th className="p-4 border">Email</th>
              <th className="p-4 border">Address</th>
              <th className="p-4 border">Order Type</th>
              <th className="p-4 border">Total Payment</th>
              <th className="p-4 border w-56">Actions</th> 
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border text-lg">
                {/* Food Details */}
                <td className="p-4 border">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 mb-3">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg border"
                      />
                      <div>
                        <p className="font-bold text-lg">{item.name}</p>
                        <p className="text-sm">Quantity: {item.quantity}</p>
                        <p className="text-sm">Rs.{item.price * item.quantity}.00</p>
                      </div>
                    </div>
                  ))}
                </td>

                {/* Customer Details */}
                <td className="p-4 border">{order.customer.name}</td>
                <td className="p-4 border">{order.customer.phone}</td>
                <td className="p-4 border">{order.customer.email}</td>
                <td className="p-4 border">{order.customer.address}</td>
                <td className="p-4 border">{order.customer.orderType}</td>
                <td className="p-4 border font-bold">Rs. {order.total}.00</td>

                {/* Actions */}
                <td className="p-4 border text-center">
                  <div className="flex justify-center gap-2">
                    {order.status !== "Confirmed" && (
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        Confirm Order
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Cancel Order
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrder;
