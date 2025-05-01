import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminHeader from "../../components/AdminHeader";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();
  const printRef = useRef();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return console.error("No token found");
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}`,
        {
          status: "Confirmed",
          trackingStatus: "Order Confirmed",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (error) {
      console.error("Error canceling order:", error);
    }
  };

  const handleTrackOrder = (order) => {
    navigate("/track-order-admin", { state: { order } });
  };

  const filteredOrders = orders.filter((order) => {
    const name = order.name || "";
    const phone = order.phone || "";
    const email = order.email || "";
    const status = order.status || "";
    return (
      (filter === "All" || status === filter) &&
      (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm) ||
        email.toLowerCase().includes(searchTerm))
    );
  });

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Ceylon Flavors - Order Summary", 14, 15);

    const tableRows = filteredOrders.map((order, index) => [
      index + 1,
      order.name,
      order.email,
      order.phone,
      `Rs.${order.total}.00`,
      order.status,
    ]);

    autoTable(doc, {
      startY: 25,
      head: [["#", "Name", "Email", "Phone", "Total (Rs)", "Status"]],
      body: tableRows,
    });

    doc.save("Admin_Order_Report.pdf");
  };

  const printReport = () => {
    const content = printRef.current.innerHTML;
    const printWindow = window.open("", "", "width=800,height=900");
    printWindow.document.write("<html><head><title>Print Orders</title></head><body>");
    printWindow.document.write(content);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">📦 Orders</h1>

      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={downloadPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          📥 Download PDF
        </button>
        <button
          onClick={printReport}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded shadow"
        >
          🖨️ Print
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg w-64 text-base shadow-sm"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg text-base shadow-sm"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

      <div ref={printRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 flex flex-col justify-between"
          >
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{order.name}</h2>
              <div className="space-y-2 text-sm text-gray-700 text-left">
                <p><span className="font-semibold">📞 Phone:</span> {order.phone}</p>
                <p><span className="font-semibold">✉️ Email:</span> {order.email}</p>
                <p><span className="font-semibold">🏠 Address:</span> {order.address}</p>
                <p><span className="font-semibold">🚚 Order Type:</span> {order.orderType}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-green-600 font-bold text-lg">Rs. {order.total}.00</p>
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 mt-4">
                  <img
                    src={`http://localhost:5000/uploads/${item.image}`}
                    alt={item.name}
                    className="w-14 h-14 rounded-md border object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-500 text-sm">Rs.{item.price * item.quantity}.00</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {order.status !== "Confirmed" && (
                  <button
                    onClick={() => handleConfirmOrder(order._id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-2 rounded shadow"
                  >
                    ✅ Confirm
                  </button>
                )}
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded shadow"
                >
                  ❌ Cancel
                </button>
              </div>
              <button
                onClick={() => handleTrackOrder(order)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded shadow"
              >
                Update Status
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrder;
