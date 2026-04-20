import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your Layout and Pages
import AppLayout from "@/components/layout/appLayout";
import Products from "@/pages/Products";
import Dashboard from "@/pages/Dashboard";
import MyOrders from "@/pages/myOrders";
import AdminOrders from "@/pages/adminOrders";
import AdminProducts from "@/pages/adminProducts";
import Login from "@/pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Route>

        {/* AppLayout for the wrapper (sidebar/navbar) for all the pages */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<Products />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* For ADMIN */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
