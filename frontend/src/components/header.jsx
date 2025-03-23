import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import Cart Context

function Header() {
  const { cartItems } = useCart();

  // Calculate total quantity of cart items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-lg rounded-b-2xl">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-wide">Ceylon Flavors</h1>
        <nav>
          <ul className="flex space-x-6 text-lg">
            <li><Link to="/">Menu</Link></li>
            <li>
              <Link to="/cart" className="relative">
                Cart {totalCartItems > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full">{totalCartItems}</span>
                )}
              </Link>
            </li>
            
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
