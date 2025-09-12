import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
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
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-12 relative">
      {/* Rolling paw icons animation */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {[...Array(3)].map((_, i) => (
          <PawPrint
            key={i}
            className={`text-indigo-400 w-6 h-6 animate-roll delay-${i * 200}`}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-white/30 animate-slide-up">
        {/* Hero Image */}
        <div className="hidden md:block md:w-1/2 h-64 md:h-auto">
          <img
            src="https://res.cloudinary.com/dbn4fllzi/image/upload/v1753724507/pngegg_b0jfct.png"
            alt="Happy pet"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 space-y-6">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Create Account
          </h2>

          {error && (
            <div className="text-red-500 text-sm mb-2 text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", placeholder: "Full Name" },
              { name: "username", placeholder: "Username" },
              { name: "email", placeholder: "Email Address", type: "email" },
              { name: "mobile", placeholder: "Mobile Number" },
              { name: "password", placeholder: "Password", type: "password" },
            ].map((field, idx) => (
              <input
                key={idx}
                type={field.type || "text"}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            ))}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-gray-900 text-white text-lg font-medium rounded-full shadow-md flex items-center justify-center transition transform ${loading
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-gray-800 hover:scale-105"
                }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-indigo-500 hover:underline"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Scoped Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease-out both;
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
};

export default Register;
