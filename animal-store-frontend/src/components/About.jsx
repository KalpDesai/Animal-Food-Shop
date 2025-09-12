// src/components/About.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PawPrint, ShoppingBag, Users } from "lucide-react";
import UserNavbar from "./UserNavbar";
import Footer from "./Footer";

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <UserNavbar />

      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-8">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-6">
            About Animal Store
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Welcome to <span className="font-semibold">Animal Store</span> – your one-stop shop
            for all things pets! 🐾
            We are passionate about making sure your furry, feathered, and scaly
            friends have the best products available. From food to accessories,
            we’ve got you covered.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <Card
              icon={<PawPrint className="h-12 w-12 text-pink-400" />}
              title="Our Mission"
              description="To provide the best quality pet products and ensure happy pets everywhere."
            />
            <Card
              icon={<ShoppingBag className="h-12 w-12 text-indigo-400" />}
              title="Our Products"
              description="From nutritious food to fun toys, we offer everything your pet needs in one place."
            />
            <Card
              icon={<Users className="h-12 w-12 text-purple-400" />}
              title="Our Community"
              description="We believe in building a community of pet lovers who share love, care, and happiness."
            />
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-12 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl text-lg font-semibold transition transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};


/* Reusable Card Component */
const Card = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <p className="text-gray-600 mt-2">{description}</p>
  </div>
);

export default About;
