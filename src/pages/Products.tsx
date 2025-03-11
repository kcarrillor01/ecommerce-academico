import { useEffect, useState } from "react";
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
}

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
            <div className="text-center mt-4">
                <Button variant="success" as={Link as any} to="/add-product">
                    Añadir Producto
                </Button>
            </div>
        </Container>
    );
};

export default Products;
