import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard, { Product } from "../../components/ProductCard/ProductCard";
import { useAuth } from "../../context/AuthContext";
import { getFavorites } from "../../services/favoritesServices";
import CardRow from "../../components/CardRow/CardRow";
import "./Home.css";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const { user } = useAuth();
  // Estado para refrescar favoritos
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  const refreshFavorites = () => setFavoritesRefresh((prev) => prev + 1);

  // Obtener todos los productos
  useEffect(() => {
    const fetchProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    };

    fetchProducts();
  }, []);

  // Agrupar productos por categoría
  useEffect(() => {
    const groups: Record<string, Product[]> = {};
    products.forEach((product) => {
      const category = product.category || "Otros";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });
    setGroupedProducts(groups);
  }, [products]);

  // Obtener IDs de favoritos del usuario (si está autenticado) y refrescarlos cuando favoritesRefresh cambie
  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (user) {
        const favIds = await getFavorites(user.uid);
        setFavoriteIds(favIds);
      }
    };
    fetchFavoriteIds();
  }, [user, favoritesRefresh]);

  // Filtrar productos favoritos a partir de todos los productos y la lista de IDs
  const favorites = products.filter((product) => favoriteIds.includes(product.id));

  return (
    <Container className="my-5">
      {/* Sección de Favoritos */}
      {favorites.length > 0 && (
        <div>
          <h2 className="text-center mb-4">Favoritos</h2>
          <CardRow>
            {favorites.map((fav) => (
              <div key={fav.id} className="product-container">
                <ProductCard product={fav} onToggleFavorite={refreshFavorites} />
              </div>
            ))}
          </CardRow>
        </div>
      )}

      {/* Sección de Categorías */}
      {Object.keys(groupedProducts).map((category) => (
        <div key={category}>
          <h2 className="text-center mb-4">{category}</h2>
          <CardRow>
            {groupedProducts[category].map((product) => (
              <div key={product.id} className="product-container">
                <ProductCard product={product} onToggleFavorite={refreshFavorites} />
              </div>
            ))}
          </CardRow>
        </div>
      ))}
    </Container>
  );
};

export default Home;
