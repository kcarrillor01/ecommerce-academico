import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard, { Product } from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<Record<string, Product[]>>({});

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

  useEffect(() => {
    // Agrupa productos por categoría (si no existe, agrupar en "Otros")
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

  return (
    <Container className="my-5">
      {Object.keys(groupedProducts).map((category) => (
        <div key={category}>
          <h2 className="text-center mb-4">{category}</h2>
          <Row className="g-4 mb-5">
            {groupedProducts[category].map((product) => (
              <Col md={3} key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </div>
      ))}
      <div className="text-center mt-4">
        <Button variant="success" as={Link as any} to="/add-product">
          Añadir Producto
        </Button>
      </div>
    </Container>
  );
};

export default Home;
