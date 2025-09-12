import React from "react";
import { FaDog, FaCat, FaFish, FaPaw } from "react-icons/fa";

const petIcons = [FaDog, FaCat, FaFish, FaPaw];

const LoaderOverlay = ({ message = "Loading...", show = false }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Pet Icons */}
      <div className="flex gap-6">
        {petIcons.map((Icon, index) => (
          <div
            key={index}
            className="text-3xl text-white animate-bounceIcon"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            <Icon />
          </div>
        ))}
      </div>

      {/* Loading Message */}
      <p className="text-white text-sm font-medium mt-6 animate-fadeIn">{message}</p>

      {/* Animations */}
      <style>{`
        @keyframes bounceIcon {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-bounceIcon {
          animation: bounceIcon 1s infinite;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default LoaderOverlay;
