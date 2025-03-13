import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductDetailPage from "./pages/ProductDetail/ProductDetail";
import NotFound from "./pages/NotFound/NotFound";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Cart from "./pages/Cart/Cart";
import Products from "./pages/Products/Products";
import MyPurchases from "./pages/MyPurchases/MyPurchases";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import AddProductPage from "./pages/AddProductPage/addProductPage";
import CheckoutFlow from "./pages/CheckoutFlow/ChekoutFlow";
import EditProductPage from "./pages/EditProductPage/EditProductPage";

// PrivateRoute para rutas protegidas
const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        {/* Rutas protegidas */}
        <Route element={<PrivateRoute />}>
          <Route path="/checkout" element={<CheckoutFlow />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/edit-product/:productId" element={<EditProductPage />} />
          <Route path="/purchases" element={<MyPurchases />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
