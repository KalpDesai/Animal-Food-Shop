import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { PawPrint } from "lucide-react"; // Logo Icon
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";

// 🔹 Reusable NavItem Component
const NavItem = ({ to, icon: Icon, children, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative group flex items-center gap-1 text-gray-800 hover:text-black transition px-2 py-1"
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

const UserNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, removeFromCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [name, setName] = useState("User");
  const [categories, setCategories] = useState([]);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const categoryRef = useRef();
  const miniCartRef = useRef();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.name) setName(user.name);

    const fetchAllCategories = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/products?limit=1000`
        );
        const data = await res.json();
        const allProducts = data.products || [];
        const uniqueCategories = [
          ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
        ].sort();
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchAllCategories();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target))
        setCategoryOpen(false);
      if (miniCartRef.current && !miniCartRef.current.contains(e.target))
        setMiniCartOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleMiniCartItemClick = (id) => {
    setMiniCartOpen(false);
    navigate(`/product/${id}`);
  };

  const currentCategory = location.pathname.startsWith("/products/category/")
    ? decodeURIComponent(location.pathname.split("/products/category/")[1])
    : null;

  return (
    <nav className="sticky top-0 z-50 w-full px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <PawPrint className="h-8 w-8 text-black" />
          <span className="text-2xl font-extrabold text-gray-900 tracking-wide">
            Animal Store
          </span>
        </div>

        {/* Hamburger for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 hover:scale-110 transition-transform"
          >
            {menuOpen ? (
              <XMarkIcon className="h-8 w-8" />
            ) : (
              <Bars3Icon className="h-8 w-8" />
            )}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-[16px] font-medium">
          <NavItem to="/dashboard" icon={HomeIcon}>
            Home
          </NavItem>

          {/* Categories Dropdown */}
          <div className="relative" ref={categoryRef}>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="relative group flex items-center gap-1 text-gray-800 hover:text-black transition px-2 py-1"
            >
              Browse by Categories
              <ChevronDownIcon className="h-4 w-4" />
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>
            <div
              className={`absolute mt-2 bg-white shadow-lg border border-gray-200 rounded-md w-48 z-50 transition-all duration-300 ease-in-out
                ${categoryOpen
                  ? "max-h-96 opacity-100 overflow-y-auto"
                  : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
              {categories.length === 0 ? (
                <div className="px-4 py-2 text-gray-500">No categories</div>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products/category/${encodeURIComponent(cat)}`}
                    className={`block px-4 py-2 hover:bg-gray-100 text-gray-700 ${currentCategory === cat
                      ? "bg-gray-100 font-semibold"
                      : ""
                      }`}
                    onClick={() => setCategoryOpen(false)}
                  >
                    {cat}
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Cart */}
          <div className="relative" ref={miniCartRef}>
            <button
              onClick={() => setMiniCartOpen(!miniCartOpen)}
              className="relative group flex items-center gap-1 text-gray-800 hover:text-black transition px-2 py-1"
            >
              <ShoppingCartIcon className="h-5 w-5" /> Cart
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>

            {/* Mini Cart */}
            <AnimatePresence>
              {miniCartOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-4 space-y-3 z-50"
                >
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500 text-center">
                      Your cart is empty
                    </p>
                  ) : (
                    <>
                      {cartItems.slice(0, 3).map((item) => (
                        <div key={item._id} className="flex items-center gap-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-lg cursor-pointer"
                            onClick={() => handleMiniCartItemClick(item._id)}
                          />
                          <div className="flex-1">
                            <h3
                              className="text-sm font-semibold text-gray-800 truncate cursor-pointer hover:text-black"
                              onClick={() => handleMiniCartItemClick(item._id)}
                            >
                              {item.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 text-xs hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {cartItems.length > 3 && (
                        <p className="text-gray-500 text-sm text-center">
                          +{cartItems.length - 3} more items
                        </p>
                      )}
                      <button
                        onClick={() => {
                          setMiniCartOpen(false);
                          navigate("/cart");
                        }}
                        className="w-full mt-2 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
                      >
                        View Cart
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavItem to="/myorders" icon={ClipboardDocumentListIcon}>
            Orders
          </NavItem>

          <NavItem to="/profile" icon={UserCircleIcon}>
            Profile
          </NavItem>

          <span className="text-base text-gray-600">
            Welcome, <span className="font-semibold">{name}</span>
          </span>

          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition flex items-center gap-1"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-lg text-gray-800 font-medium animate-fade-in">
          <NavItem to="/dashboard" icon={HomeIcon} onClick={() => setMenuOpen(false)}>
            Home
          </NavItem>

          {/* Mobile Categories */}
          <div className="flex flex-col gap-2" ref={categoryRef}>
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="relative group flex items-center gap-2 text-gray-800 hover:text-black transition"
            >
              Browse by Categories <ChevronDownIcon className="h-4 w-4" />
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </button>

            <div
              className={`flex flex-col ml-4 transition-all duration-300 ease-in-out ${categoryOpen
                ? "max-h-72 opacity-100 overflow-y-auto"
                : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
              {categories.length === 0 ? (
                <div className="px-2 py-1 text-gray-500">No categories</div>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/products/category/${encodeURIComponent(cat)}`}
                    className={`px-2 py-1 hover:bg-gray-100 rounded text-gray-700 ${currentCategory === cat ? "bg-gray-100 font-semibold" : ""
                      }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat}
                  </Link>
                ))
              )}
            </div>
          </div>

          <NavItem to="/cart" icon={ShoppingCartIcon} onClick={() => setMenuOpen(false)}>
            Cart ({totalItems})
          </NavItem>

          <NavItem to="/myorders" icon={ClipboardDocumentListIcon} onClick={() => setMenuOpen(false)}>
            Orders
          </NavItem>

          <NavItem to="/profile" icon={UserCircleIcon} onClick={() => setMenuOpen(false)}>
            Profile
          </NavItem>

          <span className="text-base text-gray-600">
            Welcome, <span className="font-semibold">{name}</span>
          </span>

          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="bg-black text-white px-4 py-1.5 rounded-lg hover:bg-gray-800 transition flex items-center gap-1"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default UserNavbar;
