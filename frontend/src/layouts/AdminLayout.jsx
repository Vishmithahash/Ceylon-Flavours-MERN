// src/layouts/AdminLayout.jsx
import React from "react";
import AdminHeader from "../components/AdminHeader";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <main className="flex-1 p-4 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
