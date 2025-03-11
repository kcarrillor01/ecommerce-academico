import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Puedes mantener tu Home actual o redirigir a Products
import Products from "./pages/Products";
import ProductDetailPage from "./pages/ProductDetailPage";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NavigationBar from "./components/NavigationBar";
import Cart from "./pages/Cart";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import AddProductPage from "./pages/addProductPage";

// Definición de PrivateRoute para rutas protegidas
const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:productId" element={<ProductDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProductPage />} />
        {/* Rutas protegidas: por ejemplo, carrito */}
        <Route element={<PrivateRoute />}>
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
