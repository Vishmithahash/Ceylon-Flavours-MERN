import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleBackToSite = () => {
    navigate("/");
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>

        <nav>
          <ul className="flex space-x-6 text-lg items-center">
            <li>
              <Link to="/admin-dashboard" className="hover:text-yellow-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/menutable" className="hover:text-yellow-300">
                Menu
              </Link>
              
            </li>

            <li>
              <Link to="/reservation-list" className="hover:text-yellow-300">
                Reservations
              </Link>
              
            </li>

            <li>
              <Link to="/admin-orders" className="hover:text-yellow-300">
                Orders
              </Link>
            </li>

            <li>
              <Link to="" className="hover:text-yellow-300">
                Deliveries
              </Link>
            </li>

            <li>
              <Link to="/adminreviewpage" className="hover:text-yellow-300">
                Reviews
              </Link>
            </li>




            <li>
              <button
                onClick={handleBackToSite}
                className="bg-yellow-500 text-gray-900 px-3 py-1 rounded hover:bg-yellow-600 transition-all duration-300"
              >
                Back to Website
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;