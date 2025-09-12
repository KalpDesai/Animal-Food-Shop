import React, { useState, useEffect } from "react";
import UserNavbar from "./UserNavbar";
import { Toaster, toast } from "sonner";
import Footer from "./Footer";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        mobile: user.mobile || "",
        password: "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Profile updated successfully!");
        setFormData({ ...formData, password: "" });
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <UserNavbar />
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              My Profile
            </h1>

            {/* Tabs */}
            <div className="flex border-b mb-6">
              {[
                { key: "info", label: "Profile Info" },
                { key: "security", label: "Security" },
                { key: "preferences", label: "Preferences" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 font-medium transition-all duration-300 ${activeTab === tab.key
                    ? "text-black border-b-2 border-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="space-y-6 animate-fadeIn">
              {/* Profile Info */}
              {activeTab === "info" && (
                <form onSubmit={handleUpdate} className="space-y-5">
                  {[
                    { label: "Name", type: "text", name: "name", required: true },
                    { label: "Username", type: "text", name: "username", required: true },
                    { label: "Email", type: "email", name: "email", required: true },
                    { label: "Mobile", type: "text", name: "mobile", required: true },
                  ].map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-gray-700 font-medium mb-2">
                        {field.label}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                      />
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center"
                  >
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </form>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <form onSubmit={handleUpdate} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep old password"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <div className="text-gray-600 space-y-4">
                  <p className="mb-2">Preferences (showcase only):</p>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Enable email notifications</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Dark mode (coming soon)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Scoped animation styles */}
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.3s ease-out both;
              }
            `}</style>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
