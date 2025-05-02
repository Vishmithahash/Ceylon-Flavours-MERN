import React, { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
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

function PlaceOrder() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    postalCode: "",
    orderType: "Pick up",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [markerPos, setMarkerPos] = useState([6.9271, 79.8612]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCustomer((prev) => ({
        ...prev,
        name: storedUser.name || "",
        phone: storedUser.mobile || "",
        email: storedUser.email || "",
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "orderType" && value === "Pick up") {
      setCustomer((prev) => ({
        ...prev,
        orderType: value,
        address: "",
        postalCode: "",
      }));
      return;
    }
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const colomboPostalCodes = [
    "00100", "00200", "00300", "00400", "00500", "00600", "00700", "00800", "00900", "01000",
    "01100", "01200", "01300", "01400", "01500", // Colombo 1–15
  
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
    "10640", "10650", "10652", "10654", "10656", "10660", "10662", "10680", "10682",
  
    // Avissawella + outer but inside Colombo District
    "10700", "10702", "10704", "10706", "10708", "10710", "10712", "10714", "10716", "10718", "10720", "10730"
  ];
  

  const handleOrder = async () => {
    if (!customer.name || !customer.phone || !customer.email || (customer.orderType === "Cash on Delivery" && (!customer.address || !customer.postalCode))) {
      alert("⚠️ Please fill all required fields");
      return;
    }
  
    if (customer.orderType === "Cash on Delivery") {
      const validPostal = colomboPostalCodes.includes(customer.postalCode);
      const validAddress = isAddressInColombo(customer.address) || isKnownColomboArea(customer.address);
  
      // 🚫 Check: address and postal code must match
      const matchFromAddress = customer.address.match(/\b\d{4,5}\b/);
      const extractedPostal = matchFromAddress ? matchFromAddress[0] : "";
  
      if (!validPostal || !validAddress) {
        alert("❌ Delivery only in Colombo district.");
        return;
      }
  
      if (extractedPostal && extractedPostal !== customer.postalCode.trim()) {
        alert(`❌ Postal Code mismatch:\nAddress includes: ${extractedPostal}\nYou entered: ${customer.postalCode}`);
        return;
      }
    }
  
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const subtotal = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);
      const deliveryFee = customer.orderType === "Pick up" ? 0 : 250;
      const total = subtotal + deliveryFee;
  
      const res = await axios.post(
        "http://localhost:5000/api/orders/create",
        {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address,
          postalCode: customer.postalCode,
          orderType: customer.orderType,
          items: cartItems,
          subtotal,
          deliveryFee,
          total,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (res.status === 201) {
        alert("🎉 Order placed!");
        clearCart();
        navigate("/order-status");
      }
    } catch (err) {
      console.error("❌ Failed to place order:", err.response?.data || err);
      alert("❌ Failed to place order");
    } finally {
      setIsLoading(false);
    }
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });



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
  
          // 🛑 Validate BEFORE state change
          if (
            customer.postalCode &&
            postalFromMap &&
            customer.postalCode.trim() !== postalFromMap.trim()
          ) {
            alert(
              `⚠️ Postal code mismatch:\nMap-selected area has postal code ${postalFromMap}, but your previous entry was ${customer.postalCode}`
            );
          }
  
          // ✅ Safe to update state
          setCustomer((prev) => ({
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
  
  
  






  return (
    <div className="container mx-auto px-4 py-10 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-xl">
      <h1 className="text-5xl font-extrabold text-center text-yellow-900 mb-12">🍽️ Your Order</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200">
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 text-xl">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-6 mb-6">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl shadow-sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-yellow-900">{item.name}</h3>
                    <p className="text-gray-600">Qty: {item.quantity}</p>
                    <p className="font-semibold">Rs.{item.price * item.quantity}.00</p>
                  </div>
                </div>
              ))}
              <div className="mt-8 border-t pt-6 bg-yellow-50 rounded-xl shadow-inner px-6 py-4">
                <div className="flex justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-700">Subtotal:</span>
                  <span className="text-lg font-semibold">Rs.{cartItems.reduce((t, i) => t + i.price * i.quantity, 0)}.00</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-lg font-semibold text-gray-700">Delivery Fee:</span>
                  <span className="text-lg font-semibold">Rs.{customer.orderType === "Pick up" ? "0.00" : "250.00"}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between mt-4">
                  <span className="text-xl font-bold text-green-700">Total:</span>
                  <span className="text-xl font-bold text-green-700">
                    Rs.{cartItems.reduce((t, i) => t + i.price * i.quantity, 0) + (customer.orderType === "Pick up" ? 0 : 250)}.00
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-yellow-200">
          <h2 className="text-3xl font-bold text-yellow-800 mb-6">📝 Your Details</h2>
          <input type="text" name="name" value={customer.name} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />
          <input type="text" name="phone" value={customer.phone} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />
          <input type="email" name="email" value={customer.email} readOnly className="w-full p-3 mb-3 border rounded-lg text-lg bg-gray-100 cursor-not-allowed" />

          <textarea name="address" placeholder="Enter your address" value={customer.address} onChange={handleChange} disabled={customer.orderType === "Pick up"} className={`w-full p-3 mb-3 border rounded-lg text-lg h-28 resize-none ${customer.orderType === "Pick up" ? "bg-gray-100 cursor-not-allowed" : ""}`} />

          {customer.orderType !== "Pick up" && (
            <div className="flex justify-end my-2">
              <button type="button" onClick={() => setShowMap(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-semibold rounded-full shadow hover:scale-105 transition">
                📍 Select via Map
              </button>
            </div>
          )}

          <input type="text" name="postalCode" placeholder="Postal Code" value={customer.postalCode} onChange={handleChange} disabled={customer.orderType === "Pick up"} className={`w-full p-3 mb-1 border rounded-lg text-lg ${customer.orderType === "Pick up" ? "bg-gray-100 cursor-not-allowed" : errors.postalCode ? "border-red-500" : "border-gray-300"}`} />
          {errors.postalCode && <p className="text-red-500 text-sm mb-2">{errors.postalCode}</p>}

          <h2 className="text-xl font-bold mt-4 mb-2">🛍️ Order Type</h2>
          <div className="flex gap-4 mb-6">
            <label className="text-lg">
              <input type="radio" name="orderType" value="Pick up" checked={customer.orderType === "Pick up"} onChange={handleChange} className="mr-2" /> Pick up
            </label>
            <label className="text-lg">
              <input type="radio" name="orderType" value="Cash on Delivery" checked={customer.orderType === "Cash on Delivery"} onChange={handleChange} className="mr-2" /> Cash on Delivery
            </label>
          </div>

          <button onClick={handleOrder} disabled={cartItems.length === 0} className="w-full bg-yellow-600 text-white p-4 rounded-lg text-xl font-bold hover:bg-yellow-700 transition">
            {isLoading ? "Processing..." : "Place Order"}
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
              <Marker position={markerPos} icon={markerIcon}></Marker>
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

export default PlaceOrder;
