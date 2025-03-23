import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrderStatus() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const handleCancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await axios.delete(`http://localhost:5000/api/orders/${id}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== id));
      } catch (error) {
        console.error("Error canceling order:", error);
      }
    }
  };

  const handleEditOrder = (order) => {
    navigate(`/update-order/${order._id}`, { state: { order } });
  };

  // Search and Filter function
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
      <h1 className="text-4xl font-bold text-center mb-6">Order Status</h1>

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-400 rounded-lg w-80 text-lg"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border border-gray-400 rounded-lg text-lg"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No orders found.</p>
      ) : (
        filteredOrders.map((order) => (
          <div key={order._id} className="bg-white p-8 shadow-lg rounded-lg border border-blue-400 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-6 mb-4">
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-lg">Quantity: {item.quantity}</p>
                      <p className="text-gray-800 font-semibold text-lg">Rs.{item.price * item.quantity}.00</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-4 border-t border-gray-300 bg-gray-100 rounded-lg">
                  <p className="font-semibold text-lg text-blue-700">Subtotal: Rs.{order.subtotal}.00</p>
                  <p className="font-semibold text-lg text-red-500">Delivery Fee: Rs.{order.deliveryFee}.00</p>
                  <hr className="my-2" />
                  <p className="font-bold text-2xl text-green-600">Total: Rs.{order.total}.00</p>
                </div>
              </div>

              {/* Customer Details */}
              <div className="text-lg leading-loose">
                <p className="font-bold text-gray-700">Name : <span className="font-normal text-black">{order.customer.name}</span></p>
                <p className="font-bold text-gray-700">Phone Number : <span className="font-normal text-black">{order.customer.phone}</span></p>
                <p className="font-bold text-gray-700">Email : <span className="font-normal text-black">{order.customer.email}</span></p>
                <p className="font-bold text-gray-700">Address : <span className="font-normal text-black">{order.customer.address}</span></p>
                <p className="font-bold text-gray-700">Order Type : <span className="font-normal text-black">{order.customer.orderType}</span></p>

                {/* Status Indicator */}
                <div className="mt-4 flex items-center gap-4">
                  <p className="font-bold text-xl">Status</p>
                  <span
                    className={`px-6 py-2 text-white text-lg font-semibold rounded-full shadow-md ${
                      order.status === "Pending" ? "bg-green-600" : "bg-purple-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-6">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleEditOrder(order)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                      Edit Order
                    </button>
                  )}

                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    Cancel Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderStatus;
