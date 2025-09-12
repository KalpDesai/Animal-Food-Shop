import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Package, ShoppingBag, Users, Shield, PawPrint } from "lucide-react";

const AdminNavbar = () => {
  const [open, setOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Manage Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Users", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Admin Users", path: "/admin/admin-users", icon: <Shield size={20} /> },
  ];

  const toggleMenu = () => {
    if (open) {
      // Animate closing
      setIsAnimating(true);
      setTimeout(() => {
        setOpen(false);
        setIsAnimating(false);
      }, 300); // duration of animation
    } else {
      setOpen(true);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <PawPrint size={28} className="text-rose-500" />
            <Link
              to="/admin/dashboard"
              className="text-2xl font-bold text-gray-800 hover:text-rose-500 transition"
            >
              Animal Store
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition ${location.pathname === item.path
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-600 hover:text-rose-600 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-rose-300"
              aria-label="Toggle menu"
            >
              {open ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown with Animation */}
      {(open || isAnimating) && (
        <div
          className={`md:hidden bg-white border-t border-gray-200 shadow-md ${open && !isAnimating ? "animate-slideDown" : "animate-slideUp"
            }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition rounded-md ${location.pathname === item.path
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-rose-600"
                }`}
              onClick={() => setOpen(false)}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </div>
      )}

      {/* Scoped Animations */}
      <style>{`
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-in forwards;
        }
      `}</style>
    </nav>
  );
};

export default AdminNavbar;
