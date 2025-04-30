import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageDeliveryPersonnel = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [form, setForm] = useState({
    DeliveryPersonID: "",
    DeliveryPersonName: "",
    DeliveryPersonContactNo: "",
    VehicleNo: "",
    Status: ""
  });
  const [editId, setEditId] = useState(null);

  // 🔎 Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const API_BASE = "http://localhost:5000/api/delivery";

  // Fetch all deliveries
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

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form validation
  const validateForm = () => {
    const { DeliveryPersonID, DeliveryPersonName, DeliveryPersonContactNo, VehicleNo, Status } = form;

    if (!DeliveryPersonID.trim()) {
      alert("Person ID is required");
      return false;
    }

    if (!DeliveryPersonName.trim()) {
      alert("Person Name is required");
      return false;
    }

    if (!/^\d{10}$/.test(DeliveryPersonContactNo)) {
      alert("Contact No should be 10 digits");
      return false;
    }

    if (!/^[A-Za-z0-9]{1,7}$/.test(VehicleNo)) {
      alert("Vehicle No should be alphanumeric and no more than 7 characters");
      return false;
    }

    if (!Status.trim()) {
      alert("Status is required");
      return false;
    }

    return true;
  };

  // Create or update delivery
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        await axios.put(`${API_BASE}/update/${editId}`, form);
        alert("Updated successfully");
      } else {
        await axios.post(`${API_BASE}/create`, form);
        alert("Added successfully");
      }

      setForm({
        DeliveryPersonID: "",
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

  // Edit delivery
  const handleEdit = (delivery) => {
    setForm({
      DeliveryPersonID: delivery.DeliveryPersonID,
      DeliveryPersonName: delivery.DeliveryPersonName,
      DeliveryPersonContactNo: delivery.DeliveryPersonContactNo,
      VehicleNo: delivery.VehicleNo,
      Status: delivery.Status
    });
    setEditId(delivery._id);
  };

  // Delete delivery
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

  // 🔎 Filtered Deliveries
  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch = delivery.DeliveryPersonName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "" || delivery.Status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Delivery Management</h1>

        {/* 🔎 Search & Filter */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Person ID</label>
            <input
              type="text"
              name="DeliveryPersonID"
              value={form.DeliveryPersonID}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Person Name</label>
            <input
              type="text"
              name="DeliveryPersonName"
              value={form.DeliveryPersonName}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Contact No</label>
            <input
              type="text"
              name="DeliveryPersonContactNo"
              value={form.DeliveryPersonContactNo}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
              pattern="\d{10}"
              maxLength={10}
              title="Contact No should be exactly 10 digits"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Vehicle No</label>
            <input
              type="text"
              name="VehicleNo"
              value={form.VehicleNo}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
              pattern="^[A-Za-z0-9]{1,7}$"
              maxLength={7}
              title="Vehicle No should be alphanumeric and no more than 7 characters"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Status</label>
            <select
              name="Status"
              value={form.Status}
              onChange={handleChange}
              className="border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="On delivery">On delivery</option>
            </select>
          </div>
           
    
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                <th className="px-4 py-3 border">#</th>
                <th className="px-4 py-3 border">Person ID</th>
                <th className="px-4 py-3 border">Person Name</th>
                <th className="px-4 py-3 border">Contact No</th>
                <th className="px-4 py-3 border">Vehicle No</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((delivery, index) => (
                <tr key={delivery._id} className="text-center border-t">
                  <td className="px-4 py-3 border">{index + 1}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonID}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonName}</td>
                  <td className="px-4 py-3 border">{delivery.DeliveryPersonContactNo}</td>
                  <td className="px-4 py-3 border">{delivery.VehicleNo}</td>
                  <td className="px-4 py-3 border">{delivery.Status}</td>
                  <td className="px-4 py-3 border space-x-2">
                    <button
                      onClick={() => handleEdit(delivery)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(delivery._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-3 text-center text-gray-500">
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
