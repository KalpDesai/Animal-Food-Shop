// src/components/MyOrders.jsx
import React, { useEffect, useState, useRef } from "react";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import LoaderOverlay from "./LoaderOverlay";
import OrderReceiptPDF from "../utils/OrderReceiptPDF";
import QRCode from "qrcode";
import { PDFDownloadLink } from "@react-pdf/renderer";

import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  XCircleIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const MyOrders = () => {
  const receiptRef = useRef();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "User";

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
    } catch (err) {
      alert("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/order/${orderId}/cancel`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Cancellation failed");
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    setSelectedOrder(null);
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o) => o.status === status));
    }
  };

  const statusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <ClockIcon className="w-4 h-4 text-yellow-600 inline" />;
      case "Shipped":
        return <TruckIcon className="w-4 h-4 text-blue-600 inline" />;
      case "Delivered":
        return <CheckCircleIcon className="w-4 h-4 text-green-600 inline" />;
      case "Cancelled":
        return <XCircleIcon className="w-4 h-4 text-red-600 inline" />;
      default:
        return null;
    }
  };
  // Generate QR code when selectedOrder changes
  useEffect(() => {
    if (!selectedOrder) {
      setQrCode(null);
      return;
    }
    const generateQRCode = async () => {
      try {
        const data = JSON.stringify(selectedOrder);
        const qr = await QRCode.toDataURL(data);
        setQrCode(qr);
      } catch (err) {
        console.error("Failed to generate QR code:", err);
      }
    };
    generateQRCode();
  }, [selectedOrder]);

  useEffect(() => {
    fetchOrders();
    const handleEsc = (e) => e.key === "Escape" && setSelectedOrder(null);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      <UserNavbar username={username} />

      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-10">
          My Orders
        </h1>

        {/* Filter */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <FunnelIcon className="w-6 h-6 text-gray-600" />
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 bg-white rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-gray-400 focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Loading Overlay */}
        < LoaderOverlay show={loading} message="Loading your orders..." />
        {loading && filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No orders found.</p>
        ) : (
          <div className="max-w-6xl mx-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                onClick={() => setSelectedOrder(order)}
                className="cursor-pointer p-5 bg-white border rounded-xl shadow hover:shadow-md hover:border-gray-400 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Order ID: <span className="text-gray-900">{order._id}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {statusIcon(order.status)} {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh] animate-fade-in">
            {/* Modal Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div
              id="order-receipt"
              ref={receiptRef}   // <-- attach ref
              className="p-6 overflow-y-auto"
            >
              <div className="space-y-2 text-sm text-gray-700 mb-6">
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Total:</strong> ₹{selectedOrder.totalAmount}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {selectedOrder.user?.email || "N/A"}
                </p>
                <p>
                  <strong>Mobile:</strong>{" "}
                  {selectedOrder.shippingInfo?.mobile || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.shippingInfo
                    ? `${selectedOrder.shippingInfo.address}, ${selectedOrder.shippingInfo.city}, ${selectedOrder.shippingInfo.postalCode}, ${selectedOrder.shippingInfo.country}`
                    : "N/A"}
                </p>
              </div>

              <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
              <ul className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-1">
                {selectedOrder.items.map((item) => (
                  <li
                    key={item._id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover border"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} • ₹{item.product.price}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-3 mt-4">
                <PDFDownloadLink
                  document={<OrderReceiptPDF order={selectedOrder} qrCode={qrCode} />}
                  fileName={`Order_${selectedOrder._id}.pdf`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                >
                  {({ loading }) => (loading ? "Generating..." : "Download PDF")}
                </PDFDownloadLink>

                {selectedOrder.status === "Pending" && (
                  <button
                    onClick={() => cancelOrder(selectedOrder._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-semibold"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.25s ease-out;
        }
        .fade-in-out {
          animation: fade-in 0.5s ease-in-out both;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default MyOrders;
