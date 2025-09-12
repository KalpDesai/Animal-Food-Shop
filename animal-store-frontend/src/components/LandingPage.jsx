// src/components/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 to-indigo-50 px-6 py-12 relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-200 rounded-full opacity-30 animate-pulse-slow"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200 rounded-full opacity-30 animate-pulse-slow"></div>

      {/* Main Card */}
      <div className="relative flex flex-col md:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 animate-slide-up">

        {/* Left Section - Illustration */}
        <div className="relative w-full md:w-1/2 bg-indigo-100 flex items-center justify-center p-6 md:p-12">
          <div className="relative bg-white p-6 rounded-full shadow-lg flex items-center justify-center">
            <img
              src="https://res.cloudinary.com/dbn4fllzi/image/upload/v1753724063/dog_va2x8q.png"
              alt="Cute pet"
              className="w-64 h-64 object-contain"
            />
            {/* Rolling paw icons */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {[...Array(3)].map((_, i) => (
                <PawPrint
                  key={i}
                  className={`text-indigo-400 w-6 h-6 animate-roll delay-${i * 200}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Content */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Give Your Pets <span className="text-indigo-600">The Best Care</span>
          </h1>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-8">
            Explore our premium, handpicked pet products. From daily essentials to special treats — everything your furry friend deserves.
          </p>

          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mb-6">
            <Link
              to="/login"
              className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-full shadow-md hover:bg-gray-800 transform hover:scale-105 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition"
            >
              Register
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Animal Store. All rights reserved.
          </p>
        </div>
      </div>

      {/* Scoped Animations */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.7s ease-out both;
        }

        @keyframes roll {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          50% { transform: translateY(-6px) rotate(180deg); opacity: 1; }
          100% { transform: translateY(0) rotate(360deg); opacity: 1; }
        }
        .animate-roll {
          animation: roll 0.8s ease-in-out forwards;
        }
        .delay-0 { animation-delay: 0s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
