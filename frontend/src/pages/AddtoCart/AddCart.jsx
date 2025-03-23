import React, { useState } from "react"; 
import { useCart } from "../../context/CartContext"; 
import { useNavigate } from "react-router-dom"; 
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react"; 

function AddCart() {
  const { cartItems, addToCart, removeFromCart, decreaseQuantity } = useCart();
  const navigate = useNavigate();

  // search/filter function
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
    <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden mx-auto p-8">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-5xl font-bold text-center">Your <span className="text-emerald-500">Cart</span></h1>
        <input 
          type="text"
          placeholder="Search cart items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg mt-4 w-80 text-lg"
        />
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center text-xl">Your cart is empty.</p>
      ) : (
        filteredItems.map((item) => (
          <div key={item._id} className="flex items-center p-6 gap-6 border-b">
            
            <img src={`http://localhost:5000/uploads/${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded-lg border" />
            
            
            <div className="flex-grow">
              <h3 className="font-bold text-xl text-gray-800">{item.name}</h3>
              <p className="text-lg text-gray-700">Price: Rs.{item.price}.00</p>
              <p className="text-lg text-gray-700">Quantity: {item.quantity}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center bg-gray-100 rounded-lg">
              <button onClick={() => decreaseQuantity(item._id)} className="px-4 py-2 text-pink-500 hover:bg-gray-200 rounded-l-lg">
                <MinusIcon size={20} />
              </button>
              <span className="px-4 py-2 text-lg">{item.quantity}</span>
              <button onClick={() => addToCart(item)} className="px-4 py-2 text-pink-500 hover:bg-gray-200 rounded-r-lg">
                <PlusIcon size={20} />
              </button>
            </div>

            
            <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
              <TrashIcon size={24} />
            </button>
          </div>
        ))
      )}

      {/*  Checkout Button */}
      <div className="p-6 bg-gray-50 flex justify-between items-center mt-6 rounded-lg">
        <h2 className="font-bold text-2xl text-gray-700">
          Total: Rs.{filteredItems.reduce((total, item) => total + item.price * item.quantity, 0)}.00
        </h2>
        <button
          onClick={handleCheckout} 
          className={`px-6 py-3 text-white text-lg rounded-lg transition ${
            filteredItems.length > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={filteredItems.length === 0}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default AddCart;
