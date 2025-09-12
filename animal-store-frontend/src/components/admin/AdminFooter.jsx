// src/components/admin/AdminFooter.jsx
import React from "react";

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Left: copyright */}
        <div className="text-gray-600 text-sm">
          &copy; {currentYear} Animal Store Admin. All rights reserved.
        </div>

        {/* Right: optional links */}
        <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
          <a href="/admin/dashboard" className="hover:text-gray-800 transition">Dashboard</a>
          <a href="/admin/products" className="hover:text-gray-800 transition">Products</a>
          <a href="/admin/orders" className="hover:text-gray-800 transition">Orders</a>
          <a href="/admin/users" className="hover:text-gray-800 transition">Users</a>
        </div>
      </div>
    </footer>
  );
}
