import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PawPrint } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setShake(true);
        throw new Error(data.message || "Login failed");
      }

      const expiry = Date.now() + 3 * 24 * 60 * 60 * 1000;
      login(data.token, data.user, expiry);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 relative">
      {/* Rolling pets animation */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {[...Array(3)].map((_, i) => (
          <PawPrint
            key={i}
            className={`text-indigo-400 w-6 h-6 animate-roll delay-${i * 200}`}
          />
        ))}
      </div>

      <div
        className={`w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 md:p-10 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 ${shake ? "animate-shake" : "animate-slide-in"
          }`}
      >
        {/* Left Illustration */}
        <div className="hidden md:flex md:w-1/2 justify-center">
          <img
            src="https://res.cloudinary.com/dbn4fllzi/image/upload/v1753917196/dog-png-22647_pkwpzu.png"
            alt="Dog Illustration"
            className="w-72 md:w-80 lg:w-96"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Login to Animal Store
          </h2>

          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 relative">
            <div>
              <label className="block text-gray-700 text-sm mb-2">
                Email or Username
              </label>
              <input
                type="text"
                name="emailOrUsername"
                placeholder="you@example.com or yourUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 pr-10 transition"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-indigo-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gray-900 text-white py-3 text-lg font-medium rounded-full shadow-md flex items-center justify-center transition transform ${loading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-800 hover:scale-105"
                }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-between text-sm text-indigo-700">
            <Link to="/" className="hover:underline">
              ← Go to Home
            </Link>
            <Link to="/register" className="hover:underline">
              Register →
            </Link>
          </div>
        </div>
      </div>

      {/* Scoped animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.6s ease-out both;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        @keyframes roll {
          0% { transform: rotate(0deg) translateY(0); opacity: 0; }
          25% { opacity: 1; }
          50% { transform: rotate(360deg) translateY(-4px); }
          100% { transform: rotate(720deg) translateY(0); opacity: 1; }
        }
        .animate-roll {
          animation: roll 1s ease-in-out forwards;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
