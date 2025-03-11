import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./context/AuthContext"; // Importa el AuthProvider
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { CartProvider } from "./context/CartContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <CartProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  </React.StrictMode>
);
