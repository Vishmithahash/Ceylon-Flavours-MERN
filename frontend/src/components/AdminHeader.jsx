import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleBackToSite = () => {
    navigate("/");
  };

  return (
    <header className="bg-[#100f21] text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>

        <nav>
          <ul className="flex space-x-6 text-lg items-center">
            <li>
              <Link
                to="/admin-dashboard"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/admin/addmenutable"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                Menu
              </Link>
            </li>
            <li>
              <Link
                to="/admin/reservation-list"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                Reservations
              </Link>
            </li>
            <li>
              <Link
                to="/admin/admin-orders"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/admin/delivery"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
                Deliveries
              </Link>
            </li>
            <li>
              <Link
                to="/admin/adminreviewpage"
                className="transition-all duration-300 ease-in-out hover:text-yellow-300 after:block after:content-[''] after:w-0 after:h-[3px] after:bg-yellow-300 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
              >
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