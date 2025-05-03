import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

function DeliveryPersonPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const deliveryPersonId = localStorage.getItem("deliveryPersonId");

  useEffect(() => {
    if (deliveryPersonId) fetchData();
  }, [deliveryPersonId]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/proxy/assigned-orders-proxy/${deliveryPersonId}`
      );
      setAssignments(res.data);
    } catch (err) {
      console.error("Error fetching assignments", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("deliveryPersonId");
    alert("Logged out");
    navigate("/enrolldelivery");
  };

  const generateEBill = async (a) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ceylon Flavors - E-Bill", 14, 20);
    doc.text(`Order ID: ${a.orderId.slice(-5)}`, 14, 30);
    doc.text(`Customer: ${a.name}`, 14, 40);
    doc.text(`Phone: ${a.phone}`, 14, 50);
    doc.text(`Address: ${a.address}`, 14, 60);

    const rows = a.items.map((item, i) => [
      i + 1,
      item.name,
      item.quantity,
      `Rs.${item.price * item.quantity}`,
    ]);

    autoTable(doc, { startY: 70, head: [["#", "Item", "Qty", "Total"]], body: rows });
    doc.text(`Total: Rs.${a.total}.00`, 14, doc.lastAutoTable.finalY + 10);
    doc.save(`${a.orderId}.pdf`);

    try {
      await axios.post(
        `http://localhost:5000/api/delivery-assignment/upload-ebill/${a.orderId}`,
        { eBillUrl: `http://localhost:5000/ebills/${a.orderId}.pdf` }
      );
      alert("✅ E-Bill uploaded");
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold text-center text-green-800 mb-8">🚚 Assigned Deliveries</h1>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-600">No assigned orders yet.</p>
      ) : (
        assignments.map((a) => (
          <div key={a.assignmentId} className="bg-white p-6 rounded-xl shadow mb-6 border border-green-200">
            <h2 className="text-xl font-bold">Order #{a.orderId.slice(-5)}</h2>
            <p><strong>Customer:</strong> {a.name}</p>
            <p><strong>Phone:</strong> {a.phone}</p>
            <p><strong>Address:</strong> {a.address}</p>
            <p><strong>Delivery Person:</strong> {a.deliveryPersonName} ({a.deliveryPersonId})</p>
            <p className="mt-2 text-green-700 font-bold">Total: Rs.{a.total}.00</p>

            <ul className="mt-2 text-sm text-gray-700 list-disc pl-6">
              {a.items.map((item, idx) => (
                <li key={idx}>{item.name} × {item.quantity}</li>
              ))}
            </ul>

            <button
              onClick={() => generateEBill(a)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              📄 Generate E-Bill
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default DeliveryPersonPage;
