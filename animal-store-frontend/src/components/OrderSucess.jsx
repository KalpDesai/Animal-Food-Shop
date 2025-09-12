// src/components/OrderSuccess.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <UserNavbar />
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 px-4">
        <div
          className={`w-full max-w-lg text-center bg-white rounded-xl p-10 shadow-xl transition-all duration-700 ease-in-out transform ${show
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-10 scale-95"
            }`}
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="h-16 w-16 text-green-600 animate-bounce" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Order Successful!
          </h1>

          {/* Message */}
          <p className="text-gray-700 text-lg mb-6">
            Thank you for your purchase.
            <br />
            Your Order ID is{" "}
            <span className="font-semibold text-gray-900">
              {order?._id || "N/A"}
            </span>
          </p>

          {/* Continue Button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-lg font-medium rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-md"
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
