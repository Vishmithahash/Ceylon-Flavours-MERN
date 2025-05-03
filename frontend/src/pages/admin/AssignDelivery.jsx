import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AssignDelivery() {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [selectedAssignments, setSelectedAssignments] = useState({});
  const [assignedList, setAssignedList] = useState(() => {
    const saved = localStorage.getItem("assignedList");
    return saved ? JSON.parse(saved) : [];
  });

  const API_ORDERS = "http://localhost:5000/api/orders";
  const API_DELIVERY = "http://localhost:5000/api/delivery";
  const API_ASSIGN = "http://localhost:5000/api/delivery-assignment/assign";

  useEffect(() => {
    const fetchConfirmedOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_ORDERS, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const confirmed = res.data.filter((order) =>
          !assignedList.some((a) => a.orderId === order._id) &&
          order.status === "Confirmed"
        );
        setOrders(confirmed);
      } catch (err) {
        console.error("Error fetching orders", err);
      }
    };
    fetchConfirmedOrders();
  }, [assignedList]);

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        const res = await axios.get(API_DELIVERY);
        const available = res.data.filter((p) => p.Status === "Available");
        setDeliveryPersons(available);
      } catch (err) {
        console.error("Error fetching personnel", err);
      }
    };
    fetchDeliveryPersons();
  }, []);

  const handleAssignmentChange = (orderId, field, value) => {
    setSelectedAssignments((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const isValidTime = (value) => {
    const pattern24 = /^([01]\d|2[0-3]):[0-5]\d$/;
    const pattern12 = /^(0?[1-9]|1[0-2]):[0-5]\d\s?(AM|PM)$/i;
    return pattern24.test(value) || pattern12.test(value);
  };

  const handleAssign = async (order) => {
    const { personId, estimatedTime } = selectedAssignments[order._id] || {};
    if (!personId || !estimatedTime) {
      alert("Please select a delivery person and enter ETA.");
      return;
    }
    if (!isValidTime(estimatedTime)) {
      alert("ETA must be a valid time like 14:00 or 10:30 AM");
      return;
    }
    try {
      await axios.post(API_ASSIGN, {
        orderId: order._id,
        deliveryPersonId: personId,
        estimatedTime,
      });

      const assigned = {
        orderId: order._id,
        shortId: `#${order._id.slice(-5)}`,
        customer: order.name,
        contact: order.phone || "N/A",
        address: order.address || "N/A",
        items: order.items.map((item) => `${item.name} x${item.quantity}`).join(", "),
        deliveryPerson: deliveryPersons.find((p) => p.DeliveryPersonID === personId)?.DeliveryPersonName || "",////////////////////////////////

        estimatedTime,
      };

      const updatedList = [...assignedList, assigned];
      setAssignedList(updatedList);
      localStorage.setItem("assignedList", JSON.stringify(updatedList));
      alert("Delivery assigned successfully!");
    } catch (err) {
      console.error("Assignment failed", err);
      alert("Failed to assign delivery.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Assigned Deliveries Report - Ceylon Flavors", 14, 15);

    const rows = assignedList.map((row, i) => [
      i + 1,
      row.shortId,
      row.customer,
      row.contact,
      row.address,
      row.items,
      row.deliveryPerson,
      row.estimatedTime,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["#", "Order", "Customer", "Contact", "Address", "Items", "Delivery Person", "ETA"]],
      body: rows,
    });

    doc.save("Assigned_Deliveries_Report.pdf");
  };

  return (
    <div className="mt-8 px-4">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">Assign Delivery</h2>

      <div className="overflow-x-auto rounded-lg shadow-md bg-white p-4 mb-10">
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-indigo-100 text-indigo-800 text-center">
            <tr>
              <th className="border p-2">Order</th>
              <th className="border p-2">Customer</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Assign To</th>
              <th className="border p-2">ETA</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border px-2 py-1 font-semibold text-indigo-700">#{order._id.slice(-5)}</td>
                  <td className="border px-2 py-1">{order.name}</td>
                  <td className="border px-2 py-1">{order.phone || "N/A"}</td>
                  <td className="border px-2 py-1 text-left">{order.address || "N/A"}</td>
                  <td className="border px-2 py-1 text-left">
                    {order.items.map((item, i) => (
                      <div key={i}>{item.name} x{item.quantity}</div>
                    ))}
                  </td>
                  <td className="border px-2 py-1">
                    <select
                      value={selectedAssignments[order._id]?.personId || ""}
                      onChange={(e) => handleAssignmentChange(order._id, "personId", e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">-- Select --</option>
                      {deliveryPersons.map((p) => (
                        <option key={p._id} value={p.DeliveryPersonID}>
                          {p.DeliveryPersonName} ({p.VehicleNo})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      placeholder="e.g. 10:30"
                      className="border rounded px-2 py-1 w-full"
                      value={selectedAssignments[order._id]?.estimatedTime || ""}
                      onChange={(e) => handleAssignmentChange(order._id, "estimatedTime", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      onClick={() => handleAssign(order)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-6">
                  No confirmed orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {assignedList.length > 0 && (
        <div className="bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-700">Assigned Deliveries</h2>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Download Report
            </button>
          </div>

          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-green-100 text-green-900 text-center">
              <tr>
                <th className="border p-2">Order</th>
                <th className="border p-2">Customer</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Address</th>
                <th className="border p-2">Items</th>
                <th className="border p-2">Delivery Person</th>
                <th className="border p-2">ETA</th>
              </tr>
            </thead>
            <tbody>
              {assignedList.map((d, i) => (
                <tr key={i} className="text-center">
                  <td className="border px-2 py-1">{d.shortId}</td>
                  <td className="border px-2 py-1">{d.customer}</td>
                  <td className="border px-2 py-1">{d.contact}</td>
                  <td className="border px-2 py-1">{d.address}</td>
                  <td className="border px-2 py-1">{d.items}</td>
                  <td className="border px-2 py-1">{d.deliveryPerson}</td>
                  <td className="border px-2 py-1">{d.estimatedTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AssignDelivery;
