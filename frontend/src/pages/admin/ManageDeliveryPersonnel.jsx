import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageDeliveryPersonnel = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    DeliveryPersonName: "",
    DeliveryPersonContactNo: "",
    VehicleNo: "",
    Status: ""
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const API_BASE = "http://localhost:5000/api/delivery";

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(API_BASE);
      setDeliveries(res.data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateUniqueId = () => {
    const ids = deliveries
      .map(d => d.DeliveryPersonID?.replace("DP", ""))
      .filter(Boolean)
      .map(Number);
    const max = ids.length > 0 ? Math.max(...ids) : 0;
    const next = (max + 1).toString().padStart(3, "0");
    return `DP${next}`;
  };

  const validateForm = () => {
    const { DeliveryPersonName, DeliveryPersonContactNo, VehicleNo, Status } = form;

    if (!DeliveryPersonName.trim()) {
      alert("Person Name is required");
      return false;
    }

    if (!/^[A-Za-z\s]+$/.test(DeliveryPersonName)) {
      alert("Name must only contain letters and spaces (no numbers or symbols)");
      return false;
    }

    if (!/^07\d{8}$/.test(DeliveryPersonContactNo)) {
      alert("Phone number must be a valid Sri Lankan number starting with 07 (10 digits)");
      return false;
    }

    if (!/^[A-Za-z]{2,3}\d{4}$/.test(VehicleNo)) {
      alert("Vehicle No must be 2–3 letters followed by 4 digits (e.g., AB1234 or XYZ4567)");
      return false;
    }

    if (!Status.trim()) {
      alert("Status is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`${API_BASE}/update/${editId}`, form);
        alert("Updated successfully");
      } else {
        await axios.post(`${API_BASE}/create`, {
          ...form,
          DeliveryPersonID: generateUniqueId()
        });
        alert("Added successfully");
      }

      setForm({
        DeliveryPersonName: "",
        DeliveryPersonContactNo: "",
        VehicleNo: "",
        Status: ""
      });
      setEditId(null);
      fetchDeliveries();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (delivery) => {
    setForm({
      DeliveryPersonName: delivery.DeliveryPersonName,
      DeliveryPersonContactNo: delivery.DeliveryPersonContactNo,
      VehicleNo: delivery.VehicleNo,
      Status: delivery.Status
    });
    setEditId(delivery._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await axios.delete(`${API_BASE}/delete/${id}`);
      alert("Deleted successfully");
      fetchDeliveries();
    } catch (error) {
      console.error("Error deleting delivery:", error);
    }
  };

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = delivery.DeliveryPersonName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || delivery.Status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-green-700">Delivery Personnel Management</h1>

        {/* 🔍 Search & Filter */}
        <div className="flex justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 w-1/2"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400"
          >
            <option value="">All Status</option>
            <option value="Available">Available</option>
            <option value="On delivery">On delivery</option>
          </select>
        </div>

        {/* 📋 Form */}
        <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-medium mb-1">Person Name</label>
            <input
              type="text"
              name="DeliveryPersonName"
              value={form.DeliveryPersonName}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="font-medium mb-1">Contact No</label>
            <input
              type="text"
              name="DeliveryPersonContactNo"
              value={form.DeliveryPersonContactNo}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
              placeholder="07XXXXXXXX"
              maxLength={10}
            />
          </div>

          <div>
            <label className="font-medium mb-1">Vehicle No</label>
            <input
              type="text"
              name="VehicleNo"
              value={form.VehicleNo}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
              placeholder="e.g. AB1234 or XYZ4567"
            />
          </div>

          <div>
            <label className="font-medium mb-1">Status</label>
            <select
              name="Status"
              value={form.Status}
              onChange={handleChange}
              className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="On delivery">On delivery</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
            >
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </form>

        {/* 📄 Table */}
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Contact No</th>
                <th className="px-4 py-3 border">Vehicle No</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border text-center">Enrollment Code</th>
                <th className="px-4 py-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery, index) => (
                <tr key={delivery._id} className="bg-white border-t hover:bg-gray-50 transition">
                  <td className="px-4 py-3 border font-medium">{index + 1}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonID}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonName}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonContactNo}</td>
                  <td className="px-4 py-3 border">{delivery.VehicleNo}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        delivery.Status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {delivery.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 border text-center font-mono text-blue-700">
                    {delivery.EnrollmentCode || "—"}
                    {delivery.EnrollmentCode && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(delivery.EnrollmentCode);
                          alert(`✅ Copied: ${delivery.EnrollmentCode}`);
                        }}
                        className="ml-2 text-xs text-green-600 underline hover:text-green-800"
                      >
                        Copy
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(delivery)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(delivery._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                    No deliveries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageDeliveryPersonnel;
