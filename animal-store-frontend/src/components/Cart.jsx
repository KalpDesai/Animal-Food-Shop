// src/components/Cart.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Toaster, toast } from "sonner";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import {
  TrashIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";

  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const handleQtyChange = (id, type) => {
    const item = cartItems.find((item) => item._id === id);
    if (!item) return;

    const newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;

    if (type === "inc" && newQty > item.stock) {
      toast.error("Cannot exceed stock limit");
      return;
    }

    updateQuantity(id, newQty);
    toast.success(`Quantity ${type === "inc" ? "increased" : "decreased"}`);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.some((item) => item.stock === 0)) {
      toast.error("Remove out-of-stock items before checkout");
      return;
    }
    navigate("/checkout");
  };

  return (
    <>
      <UserNavbar username={username} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: "#fff",
            color: "#111",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }}
      />

      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-10 flex items-center justify-center gap-2">
          <ShoppingCartIcon className="h-8 w-8" /> Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty.
          </p>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col sm:flex-row items-center bg-white rounded-2xl p-4 sm:gap-6 shadow hover:shadow-lg transition ${item.stock === 0 ? "opacity-60" : ""
                      }`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-xl border cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => navigate(`/product/${item._id}`)}
                    />

                    <div className="flex-1 w-full mt-3 sm:mt-0">
                      <h2
                        className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-black transition"
                        onClick={() => navigate(`/product/${item._id}`)}
                      >
                        {item.name}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Stock:{" "}
                        {item.stock === 0 ? (
                          <span className="text-red-500 font-medium">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="text-gray-700">{item.stock}</span>
                        )}
                      </p>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleQtyChange(item._id, "dec")}
                          className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-200 transition disabled:opacity-40"
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item._id, "inc")}
                          className="bg-gray-100 px-3 py-1 rounded-lg text-gray-700 hover:bg-gray-200 transition disabled:opacity-40"
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Price + Remove */}
                    <div className="flex flex-col items-end mt-4 sm:mt-0">
                      <p className="text-lg font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-sm text-red-500 mt-2 hover:underline flex items-center gap-1"
                      >
                        <TrashIcon className="h-4 w-4" /> Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:w-80 bg-white rounded-2xl p-6 flex flex-col gap-4 sticky top-20 self-start shadow"
            >
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Items</span>
                <span className="text-gray-800 font-semibold">
                  {cartItems.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Price</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{total}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.some((item) => item.stock === 0)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition shadow"
              >
                Proceed to Checkout
              </button>

              {cartItems.some((item) => item.stock === 0) && (
                <p className="text-red-500 text-sm mt-2">
                  Please remove out-of-stock items to continue.
                </p>
              )}
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Cart;
