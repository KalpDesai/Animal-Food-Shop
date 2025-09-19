// src/components/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";
import {
  MapPinIcon,
  PhoneIcon,
  HomeIcon,
  TruckIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  const [shippingInfo, setShippingInfo] = useState({
    mobile: userData.mobile || "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
  });

  const [editableUser, setEditableUser] = useState({
    name: userData.name || "",
    email: userData.email || "",
    mobile: userData.mobile || "",
  });

  const [loadingCity, setLoadingCity] = useState(false);
  const [loading, setLoading] = useState(false); // loader for Place Order

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

useEffect(() => {
  const fetchCity = async () => {
    const pin = shippingInfo.postalCode;
    if (/^\d{6}$/.test(pin)) {
      setLoadingCity(true);
      try {
        const resp = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const json = await resp.json();

        if (json[0]?.Status === "Success") {
          const postOffice = json[0].PostOffice?.[0];
          setShippingInfo((prev) => ({
            ...prev,
            city: postOffice?.District || "",
            country: postOffice?.State || "",
          }));
          toast.success("City & State auto-filled");
        } else {
          toast.error("No city found for that PIN");
        }
      } catch (err) {
        console.error("PIN Lookup Error:", err);
        toast.error("PIN lookup failed, please enter manually");
      } finally {
        setLoadingCity(false);
      }
    }
  };
  fetchCity();
}, [shippingInfo.postalCode]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleOrder = async () => {
    const { name, email } = editableUser;

    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      toast.error("Enter a valid email");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(shippingInfo.mobile)) {
      toast.error("Enter valid Indian mobile number");
      return;
    }
    if (!shippingInfo.address.trim()) {
      toast.error("Address is required");
      return;
    }
    if (!shippingInfo.postalCode.match(/^\d{6}$/)) {
      toast.error("Enter valid 6-digit PIN code");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
        shippingInfo: {
          ...shippingInfo,
          name,
          email,
        },
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Order failed");

      clearCart();
      toast.success("🎉 Order placed successfully!");
      navigate("/ordersuccess");
    } catch (err) {
      toast.error(`${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavbar username={username} />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gray-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TruckIcon className="h-6 w-6 text-gray-700" />
            Checkout
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Section - Shipping Info */}
            <div className="space-y-4">
              {[
                {
                  icon: UserIcon,
                  type: "text",
                  name: "name",
                  value: editableUser.name,
                  onChange: (e) =>
                    setEditableUser({ ...editableUser, name: e.target.value }),
                  placeholder: "Your Name",
                },
                {
                  icon: EnvelopeIcon,
                  type: "email",
                  name: "email",
                  value: editableUser.email,
                  onChange: (e) =>
                    setEditableUser({ ...editableUser, email: e.target.value }),
                  placeholder: "Email Address",
                },
                {
                  icon: PhoneIcon,
                  type: "text",
                  name: "mobile",
                  value: shippingInfo.mobile,
                  onChange: handleChange,
                  placeholder: "Mobile Number (10 digits)",
                },
                {
                  icon: HomeIcon,
                  type: "text",
                  name: "address",
                  value: shippingInfo.address,
                  onChange: handleChange,
                  placeholder: "Full Address",
                },
                {
                  icon: MapPinIcon,
                  type: "text",
                  name: "postalCode",
                  value: shippingInfo.postalCode,
                  onChange: handleChange,
                  placeholder: "PIN Code",
                },
              ].map(({ icon: Icon, ...input }, idx) => (
                <div key={idx} className="relative">
                  <Icon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    {...input}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-600"
                  />
                </div>
              ))}

              {/* City & State (disabled fields) */}
              {["city", "country"].map((field, idx) => (
                <div key={idx} className="relative">
                  <BuildingOfficeIcon className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name={field}
                    value={shippingInfo[field]}
                    disabled
                    placeholder={
                      field === "city"
                        ? loadingCity
                          ? "Fetching City..."
                          : "City/District"
                        : "State"
                    }
                    className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
                  />
                </div>
              ))}
            </div>

            {/* Right Section - Order Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h3>
              <ul className="divide-y divide-gray-200 mb-4">
                {cartItems.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center py-2"
                  >
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-lg font-semibold text-gray-800 border-t pt-3">
                <span>Total:</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Place Order Button with Spinner */}
          <motion.button
            whileHover={!loading ? { scale: 1.05 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            onClick={handleOrder}
            disabled={loading}
            className={`w-full mt-8 flex items-center justify-center gap-2 bg-gray-900 text-white text-lg py-3 rounded-lg shadow-md transition transform ${
              loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-gray-800 hover:scale-105"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircleIcon className="h-6 w-6" />
                Place Order
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
