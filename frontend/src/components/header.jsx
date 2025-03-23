import React from 'react';
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import Cart Context

function Header() {
  const { cartItems } = useCart();

  // Calculate total quantity of cart items
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div id="navcontent">
      <header className="bg-[#361a1d] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold tracking-wide">Ceylon Flavors</h1>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6 text-lg items-center">
              <li>
                <Link
                  to="/pages/home/home"
                  className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/addmenu"
                  className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/reservation/ReservationBackground"
                  className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full"
                >
                  Reservations
                </Link>
              </li>
              <li>
                <Link
                  to="/reviewform"
                  className="relative transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out after:hover:w-full"
                >
                  Ratings
                </Link>
              </li>
              <li className="relative">
                <Link
                  to="/cart"
                  className="transition-all duration-300 ease-in-out hover:text-yellow-300"
                >
                  Cart
                </Link>
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                    {totalCartItems}
                  </span>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Header;