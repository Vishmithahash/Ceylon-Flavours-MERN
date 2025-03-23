import React, { useState } from "react";
import { useCart } from "../../context/CartContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlaceOrder() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  
  // State for customer details
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    orderType: "Pick up", 
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  //  patterns  validation
  const namePattern = /^[A-Za-z][A-Za-z\s]*$/;
  const phonePattern = /^07\d{8}$/;
  const emailPattern = /^[a-z]+[a-z0-9]*@gmail\.com$/;

  // Handle input change with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));

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

  // Handle order submission
  const handleOrder = async () => {
    if (!customer.name || !customer.phone || !customer.email || !customer.address) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    // Final validation check
    if (!namePattern.test(customer.name) || !phonePattern.test(customer.phone) || !emailPattern.test(customer.email)) {
      alert("⚠️ Please correct validation errors before placing the order.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const orderData = {
        customer,
        items: cartItems,
        subtotal: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        deliveryFee: customer.orderType === "Pick up" ? 0 : 250,
        total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + (customer.orderType === "Pick up" ? 0 : 250),
      };

      const response = await axios.post("http://localhost:5000/api/orders/create", orderData);

      if (response.status === 201) {
        alert("🎉 Order placed successfully!");
        clearCart();
        navigate("/"); 
        return;
      }

      throw new Error("Unexpected response from server");

    } catch (error) {
      console.error("Error placing order:", error);
      setError("❌ Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">Order Summary</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center gap-6 mb-6">
              <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-24 h-24 rounded-lg" />
              <div>
                <h3 className="font-extrabold text-lg">{item.name}</h3>
                <p className="text-gray-700 text-lg">Quantity: {item.quantity}</p>
                <p className="text-gray-800 text-lg font-semibold">Rs.{item.price * item.quantity}.00</p>
              </div>
            </div>
          ))}

          <hr className="my-6" />
          <p className="font-bold text-xl">Subtotal: Rs.{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}.00</p>
          <p className="font-bold text-xl">Delivery Fee: Rs.{customer.orderType === "Pick up" ? "0.00" : "250.00"}</p>
          <hr className="my-4" />
          <p className="font-bold text-2xl text-green-600">Total: Rs.{cartItems.reduce((total, item) => total + item.price * item.quantity, 0) + (customer.orderType === "Pick up" ? 0 : 250)}.00</p>
        </div>

        {/* Customer Details Form Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={customer.name}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={customer.phone}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={customer.email}
            onChange={handleChange}
            className={`w-full p-3 mb-2 border rounded-lg text-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <textarea
            name="address"
            placeholder="Enter your address"
            value={customer.address}
            onChange={handleChange}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-lg h-28"
          ></textarea>

          <h2 className="text-xl font-bold mt-6">Order Type:</h2>
          <div className="flex gap-6 mt-4">
            <label className="text-lg">
              <input type="radio" name="orderType" value="Pick up" checked={customer.orderType === "Pick up"} onChange={handleChange} className="mr-2" /> Pick up
            </label>
            <label className="text-lg">
              <input type="radio" name="orderType" value="Cash on Delivery" checked={customer.orderType === "Cash on Delivery"} onChange={handleChange} className="mr-2" /> Cash on Delivery
            </label>
          </div>

          <button onClick={handleOrder} className="w-full mt-6 bg-green-500 text-white p-4 rounded-lg text-lg font-bold hover:bg-green-600 transition">
            {isLoading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
