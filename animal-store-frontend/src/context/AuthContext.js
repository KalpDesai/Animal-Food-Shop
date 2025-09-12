// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <--- while checking localStorage

  useEffect(() => {
    // Load token and user from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const expiry = Number(localStorage.getItem("tokenExpiry") || 0);

    if (storedToken && storedUser && Date.now() < expiry) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Auto-logout timer
      const timeout = expiry - Date.now();
      const timer = setTimeout(() => {
        logout();
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      // Token expired or missing
      localStorage.clear();
    }

    setLoading(false);
  }, []);

  const login = (newToken, newUser, expiry) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("tokenExpiry", expiry.toString());

    setToken(newToken);
    setUser(newUser);

    // Set auto-logout timer
    const timeout = expiry - Date.now();
    setTimeout(() => {
      logout();
    }, timeout);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
