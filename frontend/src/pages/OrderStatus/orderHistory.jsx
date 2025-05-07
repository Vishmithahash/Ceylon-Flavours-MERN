import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchCompletedOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("All My Orders:", response.data);

      const completed = response.data.filter((order) =>
        ["Completed", "Order Handover to Delivery", "Ready to Pick Up"].includes(order.trackingStatus)
      );

      setOrders(completed);
    } catch (err) {
      console.error("Error fetching completed orders:", err);
    }
  };

  useEffect(() => {
    fetchCompletedOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800">🧾 Completed Orders</h1>
        
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          <p>No completed orders found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Left: Items List */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <img
                        src={`http://localhost:5000/uploads/${item.image}`}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md border"
                      />

                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm text-green-600 font-bold">Rs. {item.price * item.quantity}.00</p>
                      </div>
                    </div>

                  ))}

                  
                  <div className="bg-gray-50 border border-dashed border-gray-300 p-4 rounded-lg space-y-1 mt-4">
                    <p className="text-blue-600 font-medium">Subtotal: Rs. {order.subtotal}.00</p>
                    <p className="text-red-500 font-medium">Delivery Fee: Rs. {order.deliveryFee}.00</p>
                    <p className="text-green-700 font-extrabold text-lg">
                      Total: Rs. {order.total}.00
                    </p>
                  </div>
                </div>

                {/* Right: Order Info */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="mb-4 text-center">
                    <h2 className="text-xl font-bold text-green-700">{order.name}</h2>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                  </div>
                  <div className="text-sm space-y-2 text-gray-700">
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Address:</strong> {order.address}</p>
                    <p><strong>Postal Code:</strong> {order.postalCode || "-"}</p>
                    <p><strong>Order Type:</strong> {order.orderType}</p>
                    <p>
                      <strong>Tracking Status:</strong>{" "}
                      <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700 shadow-sm">
                        {order.trackingStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => navigate("/order-status")}
          className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
        >
          ← Back to Order Status
        </button>
      </div>
    </div>
  );
}

export default OrderHistory;
