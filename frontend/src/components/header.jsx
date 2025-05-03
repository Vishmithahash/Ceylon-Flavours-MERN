import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { cartItems, clearCart } = useCart();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      clearCart();
      setUser(null);
      navigate("/");
    }
  };

  const profileImage = user?.profileImage
    ? `http://localhost:5000/${user.profileImage}`
    : "/default-profile.png";

  return (
    <div id="navcontent">
      <header className="bg-[#100f21] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold tracking-wide">Ceylon Flavors</h1>

          {/* Center Navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-6 text-lg items-center">
              {[
                { path: "/", label: "Home" },
                {
                  path: "/addmenu",
                  label: "Menu",
                  onClick: () => {
                    sessionStorage.removeItem("showSpecialMenuPage");
                    sessionStorage.removeItem("nextSpecialDate");
                  }
                },
                { path: "/reviewspage", label: "Ratings" },


                { path: "/cart", label: "Cart" }

              ].map((item) => (
                <li key={item.label} className="relative">
                  <Link
                    to={item.path}
                    onClick={item.onClick}
                    className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                  {item.path === "/cart" && totalCartItems > 0 && (
                    <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full shadow-lg">
                      {totalCartItems}
                    </span>
                  )}
                </li>
              ))}

              {/* Reservations link */}
              <li className="relative">
                <button
                  onClick={() => {
                    if (user) {
                      navigate("/reservation-management");
                    } else {
                      alert("Please login or register to continue.");
                      navigate("/login");
                    }
                  }}
                  className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
                >
                  Reservations
                </button>
              </li>
            </ul>
          </nav>

          {/* Profile image logic */}
          <div className="flex items-center space-x-4">
            <div
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (user?.role === "admin") {
                  alert("Admin profile view is not available.");
                } else if (user) {
                  navigate("/profile");
                }
              }}
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <span className="text-xs text-gray-300 mt-1">
                {user ? user.name : "Guest"}
              </span>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
