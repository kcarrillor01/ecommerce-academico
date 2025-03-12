import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductCard, { Product } from "../components/ProductCard";

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
      <h2 className="text-center mb-4">Nuestros Productos</h2>
      <Row className="g-4">
        {products.map((product) => (
          <Col md={3} key={product.id}>
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
