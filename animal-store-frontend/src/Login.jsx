import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Call login API or handler here
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl animate-fadeIn">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login to Animal Store</h2>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-left text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-lg transition shadow text-lg"
          >
            Login
          </button>

          <div className="text-sm text-center mt-2 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:underline">
              Register
            </Link>
          </div>

          <div className="text-sm text-center mt-1">
            <Link to="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
