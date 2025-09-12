import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.password) {
      toast.error("Please fill in all fields", {
        icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          emailOrUsername: form.username,
          password: form.password,
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      toast.success("Login successful", {
        icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
      });

      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        toast.error("Access denied: Not an admin", {
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed", {
        icon: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-pink-100 flex items-center justify-center px-4 py-8">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#fff",
            color: "#000",
            fontWeight: "500",
          },
        }}
      />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-indigo-200">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-8">
          Admin Portal Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 font-medium mb-2"
            >
              Username or Email
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username or email"
              value={form.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-5 w-5 animate-spin" /> Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </div>
      </div>
    </div>
  );
}
