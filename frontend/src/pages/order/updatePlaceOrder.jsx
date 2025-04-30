import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function UpdatePlaceOrder() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  const [updatedOrder, setUpdatedOrder] = useState({
    ...order,
    postalCode: order.postalCode || "",
    deliveryFee: order.orderType === "Pick up" ? 0 : 250,
    total: order.subtotal + (order.orderType === "Pick up" ? 0 : 250),
  });

  const [errors, setErrors] = useState({});
  const [showMap, setShowMap] = useState(false);
  const [markerPos, setMarkerPos] = useState([6.9271, 79.8612]);

  const colomboPostalCodes = [
    "00100", "00200", "00300", "00400", "00500", "00600", "00700", "00800",
    "00900", "01000", "01100", "01200", "01300", "01400", "01500", "10100",
    "10107", "10115", "10116", "10118", "10120", "10150", "10200", "10202",
    "10204", "10206", "10208", "10230", "10232", "10250", "10280", "10290",
    "10300", "10302", "10304", "10306", "10320", "10350", "10370", "10390",
    "10400", "10500", "10502", "10504", "10508", "10511", "10513", "10522",
    "10524", "10526", "10600", "10620", "10640", "10650", "10654", "10656",
    "10680", "10682", "10700", "10704", "10712", "10714", "10718", "10730"
  ];

  const isAddressInColombo = (address) => {
    return address.toLowerCase().includes("colombo district");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "postalCode" && updatedOrder.orderType === "Cash on Delivery" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        postalCode: "⚠️ Postal Code is required.",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        postalCode: "",
      }));
    }
  };

  const handleOrderTypeChange = (e) => {
    const selectedOrderType = e.target.value;
    const isPickup = selectedOrderType === "Pick up";
    setUpdatedOrder((prev) => ({
      ...prev,
      orderType: selectedOrderType,
      address: isPickup ? "" : prev.address,
      postalCode: isPickup ? "" : prev.postalCode,
      deliveryFee: isPickup ? 0 : 250,
      total: prev.subtotal + (isPickup ? 0 : 250),
    }));
  };

  const handleUpdateOrder = async () => {
    const { name, phone, email, address, postalCode, orderType, items, subtotal, deliveryFee, total } = updatedOrder;

    if (!name || !phone || !email || (orderType === "Cash on Delivery" && (!address || !postalCode))) {
      alert("⚠️ Please fill in all required fields!");
      return;
    }

    if (orderType === "Cash on Delivery") {
      const validPostal = colomboPostalCodes.includes(postalCode);
      const validAddress = isAddressInColombo(address);
      if (!validPostal || !validAddress) {
        alert("❌ Cash on Delivery only available within Colombo district.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        name,
        phone,
        email,
        address: orderType === "Cash on Delivery" ? address : "",
        postalCode: orderType === "Cash on Delivery" ? postalCode : "",
        orderType,
        items,
        subtotal,
        deliveryFee,
        total,
      };

      await axios.patch(`http://localhost:5000/api/orders/${order._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("🎉 Order updated successfully!");
      navigate("/order-status");
    } catch (error) {
      console.error("❌ Error updating order:", error.response?.data || error.message);
      alert("❌ Failed to update the order. Please try again.");
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        setMarkerPos([e.latlng.lat, e.latlng.lng]);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
        );
        const data = await res.json();
        if (data?.display_name) {
          setUpdatedOrder((prev) => ({
            ...prev,
            address: data.display_name,
          }));
        }
        setShowMap(false);
      },
    });
    return null;
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="container mx-auto px-4 py-10 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-center text-yellow-900 mb-12">Update Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200">
          {updatedOrder.items.map((item) => (
            <div key={item._id} className="flex items-center gap-6 mb-6">
              <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-24 h-24 rounded-xl shadow-sm" />
              <div>
                <h3 className="font-extrabold text-lg text-yellow-900">{item.name}</h3>
                <p className="text-gray-600">Qty: {item.quantity}</p>
                <p className="font-semibold">Rs.{item.price * item.quantity}.00</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-800 mb-6">📝 Update Your Details</h2>

          <input type="text" name="name" value={updatedOrder.name} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />
          <input type="text" name="phone" value={updatedOrder.phone} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />
          <input type="email" name="email" value={updatedOrder.email} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />

          <textarea name="address" placeholder="Address" value={updatedOrder.address} onChange={handleChange} className="w-full p-3 mb-3 border rounded-lg text-lg h-28 resize-none" />

          {updatedOrder.orderType === "Cash on Delivery" && (
            <div className="flex justify-end my-2">
              <button type="button" onClick={() => setShowMap(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow hover:scale-105 transition">
                📍 Select via Map
              </button>
            </div>
          )}

          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={updatedOrder.postalCode}
            onChange={handleChange}
            disabled={updatedOrder.orderType === "Pick up"}
            className={`w-full p-3 mb-1 border rounded-lg text-lg ${
              updatedOrder.orderType === "Pick up" ? "bg-gray-100 cursor-not-allowed" :
              errors.postalCode ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}

          <h2 className="text-xl font-bold mt-4 mb-2">🛍️ Order Type</h2>
          <div className="flex gap-4 mb-6">
            <label className="text-lg">
              <input type="radio" name="orderType" value="Pick up" checked={updatedOrder.orderType === "Pick up"} onChange={handleOrderTypeChange} className="mr-2" /> Pick up
            </label>
            <label className="text-lg">
              <input type="radio" name="orderType" value="Cash on Delivery" checked={updatedOrder.orderType === "Cash on Delivery"} onChange={handleOrderTypeChange} className="mr-2" /> Cash on Delivery
            </label>
          </div>

          <button onClick={handleUpdateOrder} className="w-full bg-yellow-600 text-white p-4 rounded-lg text-xl font-bold hover:bg-yellow-700 transition">
            Update Order
          </button>
        </div>
      </div>

      {showMap && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-4 shadow-xl w-[90%] max-w-3xl">
            <MapContainer center={markerPos} zoom={13} style={{ height: "400px", width: "100%" }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler />
              <Marker position={markerPos} icon={markerIcon} />
            </MapContainer>
            <div className="text-right mt-2">
              <button onClick={() => setShowMap(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UpdatePlaceOrder;
