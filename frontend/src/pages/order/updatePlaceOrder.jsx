import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdatePlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  //  State for updated order details
  const [updatedOrder, setUpdatedOrder] = useState({
    ...order,
    customer: { ...order.customer },
    orderType: order.customer.orderType,
    deliveryFee: order.customer.orderType === "Pick up" ? 0 : 250, 
    total: order.subtotal + (order.customer.orderType === "Pick up" ? 0 : 250),
  });

  const [errors, setErrors] = useState({});

  //  Validation Patterns
  const namePattern = /^[A-Za-z][A-Za-z\s]*$/;
  const phonePattern = /^07\d{8}$/;
  const emailPattern = /^[a-z]+[a-z0-9]*@gmail\.com$/;

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prevOrder) => ({
      ...prevOrder,
      customer: { ...prevOrder.customer, [name]: value },
    }));

    let newErrors = { ...errors };

    if (name === "name") {
      newErrors.name = !namePattern.test(value) ? "⚠️ Name must start with a letter." : "";
    }

    if (name === "phone") {
      newErrors.phone = !phonePattern.test(value) ? "⚠️ Must start with '07' and be 10 digits long." : "";
    }

    if (name === "email") {
      newErrors.email = !emailPattern.test(value) ? "⚠️ Must be a valid Gmail address (e.g. user@gmail.com)." : "";
    }

    setErrors(newErrors);
  };

  //  Handle Order Type Selection
  const handleOrderTypeChange = (e) => {
    const selectedOrderType = e.target.value;
    setUpdatedOrder((prevOrder) => ({
      ...prevOrder,
      customer: { ...prevOrder.customer, orderType: selectedOrderType },
      deliveryFee: selectedOrderType === "Pick up" ? 0 : 250, 
      total: prevOrder.subtotal + (selectedOrderType === "Pick up" ? 0 : 250),
    }));
  };

  //  Handle Order Update in Database
  const handleUpdateOrder = async () => {
    if (!updatedOrder.customer.name || !updatedOrder.customer.phone || !updatedOrder.customer.email || !updatedOrder.customer.address) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    if (!namePattern.test(updatedOrder.customer.name) || !phonePattern.test(updatedOrder.customer.phone) || !emailPattern.test(updatedOrder.customer.email)) {
      alert("⚠️ Please correct validation errors before updating the order.");
      return;
    }

    try {
      const updatedData = {
        ...updatedOrder,
      };

      await axios.patch(`http://localhost:5000/api/orders/${order._id}`, updatedData);
      alert("🎉 Order updated successfully!");
      navigate("/order-status");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Update Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {updatedOrder.items.map((item) => (
            <div key={item._id} className="flex items-center gap-6 mb-6">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="w-24 h-24 rounded-lg"
              />
              <div>
                <h3 className="font-extrabold text-lg">{item.name}</h3>
                <p className="text-gray-700 text-lg">Quantity: {item.quantity}</p>
                <p className="text-gray-800 text-lg font-semibold">
                  Rs.{item.price * item.quantity}.00
                </p>
              </div>
            </div>
          ))}

          <hr className="my-6" />
          <p className="font-bold text-xl">Subtotal: Rs.{updatedOrder.subtotal}.00</p>
          <p className="font-bold text-xl">
            Delivery Fee: Rs.{updatedOrder.deliveryFee}.00
          </p>
          <hr className="my-4" />
          <p className="font-bold text-2xl text-green-600">
            Total: Rs.{updatedOrder.total}.00
          </p>
        </div>

        {/* Customer Details Form  */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Update Your Details</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={updatedOrder.customer.name}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={updatedOrder.customer.phone}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={updatedOrder.customer.email}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <textarea
            name="address"
            placeholder="Address"
            value={updatedOrder.customer.address}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg h-28"
          ></textarea>

          <h2 className="text-xl font-bold mt-6">Order Type:</h2>
          <div className="flex gap-6 mt-4">
            <label className="text-lg">
              <input
                type="radio"
                name="orderType"
                value="Pick up"
                checked={updatedOrder.customer.orderType === "Pick up"}
                onChange={handleOrderTypeChange}
                className="mr-2"
              />{" "}
              Pick up
            </label>
            <label className="text-lg">
              <input
                type="radio"
                name="orderType"
                value="Cash on Delivery"
                checked={updatedOrder.customer.orderType === "Cash on Delivery"}
                onChange={handleOrderTypeChange}
                className="mr-2"
              />{" "}
              Cash on Delivery
            </label>
          </div>

          <button
            onClick={handleUpdateOrder}
            className="w-full mt-6 bg-green-500 text-white p-4 rounded-lg text-lg font-bold hover:bg-green-600 transition"
          >
            Update Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePlaceOrder;
