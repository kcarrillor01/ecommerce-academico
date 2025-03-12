import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductDetailPage from "./pages/ProductDetail/ProductDetail";
import NotFound from "./pages/NotFound/NotFound";
import NavigationBar from "./components/NavigationBar/NavigationBar";
import Cart from "./pages/Cart/Cart";
import Products from "./pages/Products/Products";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import AddProductPage from "./pages/AddProductPage/addProductPage";
import CheckoutFlow from "./pages/CheckoutFlow/ChekoutFlow";
import MyPurchases from "./pages/MyPurchases/MyPurchases";

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
        <Route path="/add-product" element={<AddProductPage />} />
        {/* Rutas protegidas para usuarios autenticados */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckoutFlow />} />
          <Route path="/purchases" element={<MyPurchases />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
