import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard, { Product } from "../../components/ProductCard/ProductCard";
import { db } from "../../firebase";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Todos los Productos</h2>
      <Row className="g-4">
        {products.map((product) => (
          <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="success" as={Link as any} to="/add-product">
          Añadir Producto
        </Button>
      </div>
    </Container>
  );
};

export default Products;
