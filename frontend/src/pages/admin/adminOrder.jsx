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
    <div className="container mx-auto px-6 py-10 font-sans bg-gradient-to-br from-yellow-50 to-white min-h-screen">
      <h1 className="text-5xl font-extrabold text-center text-yellow-900 mb-12 drop-shadow-sm">📦 Orders</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={downloadPDF}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          📥 Download PDF
        </button>
        <button
          onClick={printReport}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-md transition-transform transform hover:scale-105"
        >
          🖨️ Print
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <input
          type="text"
          placeholder="🔍 Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 border border-gray-300 rounded-full w-64 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 border border-gray-300 rounded-full text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

      <div ref={printRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {filteredOrders.map((order) => {
          const mid = Math.ceil(order.items.length / 2);
          const leftItems = order.items.slice(0, mid);
          const rightItems = order.items.slice(mid);

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-xl border border-yellow-200 p-6 flex flex-col justify-between transition-shadow hover:shadow-2xl"
            >
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4 uppercase tracking-wide">
                  {order.name}
                </h2>
                <div className="space-y-2 text-sm text-gray-700 text-left font-medium">
                  <p><span className="font-semibold">📞 Phone:</span> {order.phone}</p>
                  <p><span className="font-semibold">✉️ Email:</span> {order.email}</p>
                  <p><span className="font-semibold">🏠 Address:</span> {order.address}</p>
                  <p><span className="font-semibold">🚚 Order Type:</span> {order.orderType}</p>
                </div>
              </div>

              <p className="text-green-600 font-bold text-lg mb-4 text-center">
                <span className="text-gray-700 font-semibold">Total:</span> Rs. {order.total}.00
              </p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {[leftItems, rightItems].map((column, colIndex) => (
                  <div key={colIndex} className="space-y-4">
                    {column.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <img
                          src={`http://localhost:5000/uploads/${item.image}`}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg border-2 border-yellow-300 object-cover"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                          <p className="text-gray-500 text-xs">Rs.{item.price * item.quantity}.00</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  {order.status !== "Confirmed" && (
                    <button
                      onClick={() => handleConfirmOrder(order._id)}
                      className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-full shadow"
                    >
                      ✅ Confirm
                    </button>
                  )}
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full shadow"
                  >
                    ❌ Cancel
                  </button>
                </div>
                <button
                  onClick={() => handleTrackOrder(order)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-full shadow"
                >
                  Update Status
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminOrder;
