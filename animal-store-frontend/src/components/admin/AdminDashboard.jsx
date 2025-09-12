// src/components/admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { ShoppingBagIcon, CubeIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  // Fetch Orders
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

  // Fetch Products
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async (opts = {}) => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        page: opts.page ?? page,
        limit: 100, // fetch all for stats
        ...(opts.search !== undefined ? { search: opts.search } : {}),
      }).toString();

      const res = await axios.get(
        `http://localhost:5000/api/products?${q}`
      );
      const data = res.data;
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Failed to load products";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Chart Data (Orders by Date)
  const ordersByDate = {};
  orders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  const chartData = Object.entries(ordersByDate).map(([date, count]) => ({
    date,
    count,
  }));

  const recentOrders = orders.slice(0, 5);

  // Skeleton Loader
  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );

  return (
    <>
      <AdminNavbar />
      <Toaster position="top-center" />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {loading ? (
          <>
            {/* Skeleton for Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Skeleton for Chart */}
            <Skeleton className="h-72 w-full mb-8" />

            {/* Skeleton for Table */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-40 w-full" />
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                <CubeIcon className="h-10 w-10 text-indigo-600" />
                <div>
                  <p className="text-gray-600">Total Products</p>
                  <h2 className="text-2xl font-bold">{products.length}</h2>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
                <ShoppingBagIcon className="h-10 w-10 text-green-600" />
                <div>
                  <p className="text-gray-600">Total Orders</p>
                  <h2 className="text-2xl font-bold">{orders.length}</h2>
                </div>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Orders Overview
              </h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#4f46e5"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500">No order data available</p>
              )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Recent Orders
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="p-3 text-sm">{order._id.slice(-6)}</td>
                          <td className="p-3 text-sm">
                            {order.user?.name || "N/A"}
                          </td>
                          <td className="p-3 text-sm font-semibold text-indigo-600">
                            ₹{order.totalAmount}
                          </td>
                          <td className="p-3 text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "delivered"
                                  ? "bg-green-100 text-green-600"
                                  : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                            >
                              {order.status || "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="p-3 text-center text-gray-500"
                        >
                          No recent orders
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default Dashboard;
