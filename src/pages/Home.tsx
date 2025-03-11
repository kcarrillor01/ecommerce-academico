import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: string; // Campo para la categoría
}

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
    // Agrupa productos por categoría
    const groups: Record<string, Product[]> = {};
    products.forEach((product) => {
      // Si no existe el campo "category", agrupar en "Otros"
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
                <Card>
                  <Card.Img variant="top" src={product.image} />
                  <Card.Body>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                      Precio: ${product.price.toFixed(2)} <br />
                      Stock: {product.stock}
                    </Card.Text>
                    <Button variant="primary" as={Link as any} to={`/product/${product.id}`}>
                      Ver Detalle
                    </Button>
                  </Card.Body>
                </Card>
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
