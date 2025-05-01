import React, { useState } from "react"; 
import { useCart } from "../../context/CartContext"; 
import { useNavigate } from "react-router-dom"; 
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react"; 

function AddCart() {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/place-order");
    }
  };

  const filteredItems = cartItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full min-h-screen px-4 pt-6 bg-gray-100">

     

      {/* Cart Box */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden p-10 mt-20">

        {/* Title & Search */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-5xl font-extrabold text-gray-800 text-center">
            Your <span className="text-green-500">Cart</span>
          </h1>
          <input 
            type="text"
            placeholder="Search cart items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-6 p-4 border border-gray-300 rounded-full w-80 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        {/* Cart Content */}
        {filteredItems.length === 0 ? (
          <p className="text-gray-500 text-center text-xl">🛒 Your cart is empty.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-6 mb-4 bg-gray-50 rounded-xl shadow-sm border">
              <div className="flex items-center gap-6">
                <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded-xl border" />
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
                  <p className="text-md text-gray-600">Rs.{item.price}.00</p>
                  <p className="text-md text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border rounded-lg shadow-sm overflow-hidden">
                  <button onClick={() => decreaseQuantity(item._id)} className="px-3 py-2 text-red-500 hover:bg-red-100 transition">
                    <MinusIcon size={18} />
                  </button>
                  <span className="px-4 py-2 text-lg">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="px-3 py-2 text-green-500 hover:bg-green-100 transition">
                    <PlusIcon size={18} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition"
                >
                  <TrashIcon size={20} />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Summary + Checkout */}
        <div className="p-6 mt-8 bg-gray-100 rounded-xl flex justify-between items-center shadow-sm border">
          <h2 className="font-bold text-2xl text-gray-700">
            Total: Rs.{filteredItems.reduce((total, item) => total + item.price * item.quantity, 0)}.00
          </h2>
          <button
            onClick={handleCheckout} 
            className={`px-8 py-3 text-white text-lg rounded-full font-semibold shadow-lg transition ${
              filteredItems.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={filteredItems.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCart;
