// src/components/admin/OrderList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Search & filter states
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(
        "http://localhost:5000/api/orders/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Order status updated to "${status}"`);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order deleted");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  // Badge generator
  const StatusBadge = ({ status }) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-700",
      Processing: "bg-blue-100 text-blue-700",
      Shipped: "bg-purple-100 text-purple-700",
      Delivered: "bg-green-100 text-green-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}
      >
        {status}
      </span>
    );
  };

  // Search + Filter Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "All" ? true : order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <AdminNavbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: { background: "#fff", color: "#000", fontWeight: "500" },
        }}
      />

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">All Orders</h2>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <input
            type="text"
            placeholder="Search by Order ID or User"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-1/3 focus:ring focus:ring-indigo-200"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded-md px-3 py-2 w-full md:w-1/4 focus:ring focus:ring-indigo-200"
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <p className="text-gray-600">No orders found</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                  <th className="p-3 border">Order ID</th>
                  <th className="p-3 border">User</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Created At</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id}
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                  >
                    <td className="p-3 border font-mono text-xs">{order._id}</td>
                    <td className="p-3 border">{order.user?.name || "N/A"}</td>
                    <td className="p-3 border font-semibold text-indigo-600">
                      ₹{order.totalAmount}
                    </td>
                    <td className="p-3 border">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={order.status} />
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="border rounded-md px-2 py-1 text-xs focus:ring focus:ring-indigo-300"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                    <td className="p-3 border text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 border space-x-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Redesigned Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 border-b pb-2">
              Order Details
            </h3>

            {/* User Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold">User Info</p>
                <p>{selectedOrder.user?.name}</p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.user?.mobile}
                </p>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-semibold">Shipping Address</p>
                <p>{selectedOrder.shippingInfo?.address}</p>
                <p>
                  {selectedOrder.shippingInfo?.city},{" "}
                  {selectedOrder.shippingInfo?.country}
                </p>
                <p>{selectedOrder.shippingInfo?.postalCode}</p>
              </div>
            </div>

            {/* Order Info */}
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <p>
                <strong>Total Amount:</strong>{" "}
                <span className="text-indigo-600 font-semibold">
                  ₹{selectedOrder.totalAmount}
                </span>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <StatusBadge status={selectedOrder.status} />
              </p>
            </div>

            {/* Items */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-2">Items</p>
              <ul className="divide-y text-sm">
                {selectedOrder.items.map((item) => (
                  <li key={item._id} className="py-2">
                    {typeof item.product === "object" ? (
                      <>
                        <span className="font-medium">
                          {item.product?.name}
                        </span>{" "}
                        × {item.quantity}{" "}
                        <span className="text-gray-600">
                          (₹{item.product?.price})
                        </span>
                      </>
                    ) : (
                      <>Product ID: {item.product} × {item.quantity}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 px-5 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
      < AdminFooter />
    </div>
  );
}
