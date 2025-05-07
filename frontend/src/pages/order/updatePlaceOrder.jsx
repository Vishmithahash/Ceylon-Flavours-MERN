import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";



const allColomboAreas = [
  // Urban Areas
  "colombo", "pettah", "fort", "bambalapitiya", "kollupitiya", "maradana",
  "wellawatte", "dematagoda", "borella", "havelock town", "slave island",
  "thimbirigasyaya", "kirulapone", "mutwal", "grandpass", "orugodawatta",
  "wellampitiya", "meethotamulla", "panchikawatta", "maligawatta",
  "bloemendhal", "hultsdorf", "wolvendhal",



  // Suburban Areas
  "nawala", "nugegoda", "rajagiriya", "pita kotte", "ethul kotte",
  "pelawatte", "battaramulla", "koswatta", "talawatugoda", "malabe",
  "kottawa", "maharagama", "pannipitiya", "dehiwala", "mt lavinia",
  "ratmalana", "boralesgamuwa", "bellanwila", "madiwela", "hokandara",
  "moratuwa", "angulana", "piliyandala", "kesbewa", "kotikawatta",
  "kolonnawa", "angoda", "nabimana", "delkanda", "thalahena",
  "mulleriyawa", "udahamulla", "kohuwala", "pagoda", "polhengoda",
  "kalubowila", "sri jayawardenepura", "hendala", "udahamulla north",
  "udahamulla south", "wijerama", "madiwela west", "rathmaldeniya",
  "mirihana", "kawdana", "nadimala", "pepiliyana", "wattegedara", "kaduwela",
  "korathota", "nawagamuwa", "ranala", "weliwita", "wewala", "polwatta", "malapalla", "pore", "kithulwala",

  // Rural Areas
  "homagama", "meegoda", "padukka", "hanwella", "avissawella", "godagama",
  "pitipana", "watareka", "pallebedda", "raththanapitiya", "weligama junction",
  "athurugiriya", "habarakada", "habarakada north", "habarakada south", 
  "polgasowita", "madapatha", "katuwawala", "rukmalgama", "talahena east",
  "idama", "makumbura", "mattegoda", "galawila", "werahera", "bokundara",
  "kiriwaththuduwa", "gonapola", "siyambalape", "henpita", "pitumpe",
  "dolekade", "millaniya (partial)", "henawita", "talagala"
];

const isKnownColomboArea = (address) => {
  const lowerAddress = address.toLowerCase();
  return allColomboAreas.some((area) => lowerAddress.includes(area));
};

const isAddressInColombo = (address) => {
  return address.toLowerCase().includes("colombo district");
};

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
    // Colombo 1–15
    "00100", "00200", "00300", "00400", "00500", "00600", "00700", "00800", "00900", "01000",
    "01100", "01200", "01300", "01400", "01500",
  
    // Greater Colombo Area (Suburban + Urban)
    "10100", "10107", "10108", "10110", "10115", "10116", "10118", "10120", "10150", "10160", "10162",
  
    // Maharagama, Kottawa, Pannipitiya, etc.
    "10200", "10202", "10204", "10206", "10208", "10210", "10212", "10220", "10222", "10224",
    "10230", "10232", "10234", "10236", "10250", "10252", "10254", "10256", "10258", "10260",
    "10280", "10290",
  
    // Piliyandala, Moratuwa, Ratmalana
    "10300", "10302", "10304", "10306", "10308", "10310", "10312", "10314", "10316", "10318",
    "10320", "10322", "10324", "10330", "10332", "10350", "10370", "10390", "10400",
  
    // Padukka, Hanwella, Homagama region
    "10500", "10502", "10504", "10506", "10508", "10510", "10511", "10513", "10520", "10522", "10524", "10526",
  
    // Kaduwela, Angoda, Malabe, Thalahena
    "10600", "10604", "10610", "10620", "10622", "10624", "10626", "10630", "10632", "10634",
    "10640", "10650", "10652", "10654", "10656", "10680", "10682",
  
    // Avissawella & Seethawaka area inside Colombo
    "10700", "10702", "10704", "10706", "10708", "10710", "10712", "10714", "10716",
    "10718", "10720", "10730", "10732"
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedOrder((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "postalCode" && updatedOrder.orderType === "Cash on Delivery" && !value.trim()) {
      setErrors((prev) => ({
        ...prev,
        postalCode: "\u26A0\uFE0F Postal Code is required.",
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
      const validAddress = isAddressInColombo(address) || isKnownColomboArea(address);
  
      const matchFromAddress = address.match(/\b\d{4,5}\b/);
      const extractedPostal = matchFromAddress ? matchFromAddress[0] : "";
  
      if (!validPostal || !validAddress) {
        alert("❌ Cash on Delivery only available within Colombo district.");
        return;
      }
  
      if (extractedPostal && extractedPostal !== postalCode.trim()) {
        alert(`❌ Postal Code mismatch:\nAddress includes: ${extractedPostal}\nYou entered: ${postalCode}`);
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
          const postalFromMap = data?.address?.postcode;
          const addressFromMap = data.display_name;
  
          if (
            updatedOrder.postalCode &&
            postalFromMap &&
            updatedOrder.postalCode.trim() !== postalFromMap.trim()
          ) {
            alert(
              `⚠️ Postal code mismatch:\nMap-selected area has postal code ${postalFromMap},\nbut your previous entry was ${updatedOrder.postalCode}`
            );
          }
  
          setUpdatedOrder((prev) => ({
            ...prev,
            address: addressFromMap,
            postalCode: postalFromMap || "",
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

          <textarea
              name="address"
              placeholder="Address"
              value={updatedOrder.address}
              onChange={handleChange}
              disabled={updatedOrder.orderType === "Pick up"}
              className={`w-full p-3 mb-3 border rounded-lg text-lg h-28 resize-none ${
              updatedOrder.orderType === "Pick up" ? "bg-gray-100 cursor-not-allowed" : ""
             }`}
          />


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
