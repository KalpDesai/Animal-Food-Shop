// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import SingleProduct from './components/SingleProduct';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSucess';
import Profile from './components/Profile';
import { useAuth } from './context/AuthContext';
import MyOrders from './components/MyOrders';
import About from './components/About';

//admin
import AdminDashboard from './components/admin/AdminDashboard';
import ManageProducts from './components/admin/ManageProducts';
import EditProduct from './components/admin/EditProduct';
import AddProduct from './components/admin/AddProduct';
import OrderList from './components/admin/OrderList';
import CategoryProducts from "./components/CategoryProducts";
import AdminLogin from './components/admin/AdminLogin';


const App = () => {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/myorders" element={<MyOrders />} />
      {/* Protected Routes */}

<Route path="/products/category/:category" element={<CategoryProducts />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/checkout"
        element={token ? <Checkout /> : <Navigate to="/login" />}
      />
      <Route
        path="/ordersuccess"
        element={token ? <OrderSuccess /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile" //Add profile route
        element={token ? <Profile /> : <Navigate to="/login" />}
      />
        <Route path="/about" element={<About />} />



       <Route path="/admin/login" element={<AdminLogin />} />
       <Route path="/admin/dashboard" element={<AdminDashboard />} />
       <Route path="/admin/products" element={<ManageProducts />} />
       <Route path='/admin/products/:id/edit' element={<EditProduct />} />
       <Route path="/admin/products/new" element={<AddProduct />}/>
       <Route path="/admin/orders" element={<OrderList />}/>
    </Routes>

    
  );
};

export default App;
