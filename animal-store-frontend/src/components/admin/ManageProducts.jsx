// src/components/admin/ManageProducts.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import AdminFooter from "./AdminFooter";
import { Toaster, toast } from "sonner";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [page]);

  const fetchProducts = async (opts = {}) => {
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({
        page: opts.page ?? page,
        limit,
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
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts({ page: 1, search });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this product?");
    if (!ok) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Delete failed";
      toast.error(" " + msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <AdminNavbar />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#000",
            fontWeight: "500",
          },
        }}
      />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">Manage Products</h2>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-rose-300 outline-none transition"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-rose-500 text-white rounded-r-md hover:bg-rose-600 transition"
              >
                Search
              </button>
            </form>
            <Link
              to="/admin/products/new"
              className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-center"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-6 text-center space-y-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-600">{error}</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Image</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Category</th>
                    <th className="px-4 py-3 text-right font-semibold">Price</th>
                    <th className="px-4 py-3 text-right font-semibold">Stock</th>
                    <th className="px-4 py-3 text-center font-semibold">Featured</th>
                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p, i) => (
                    <tr
                      key={p._id}
                      className={`hover:bg-gray-50 transition ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                    >
                      <td className="px-4 py-3">
                        <img
                          src={p.imageUrl || p.image || "/placeholder.png"}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded-md border border-gray-200"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3">{p.category}</td>
                      <td className="px-4 py-3 text-right text-rose-600 font-semibold">
                        ₹{p.price}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {p.stock > 0 ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {p.stock}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            Out
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {p.isFeatured ? (
                          <span className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Yes
                          </span>
                        ) : (
                          <span className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center space-x-2">
                        <Link
                          to={`/admin/products/${p._id}/edit`}
                          className="px-3 py-1 bg-yellow-500 text-white text-xs rounded-md hover:bg-yellow-600 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600 transition"
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
          <div className="text-sm text-gray-600">
            Page <span className="font-semibold">{page}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
}
