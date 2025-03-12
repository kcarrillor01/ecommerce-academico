import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify";
import FavoriteButton from "../../components/FavoriteButton/FavoriteButton";
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";
import { Product } from "../../components/ProductCard/ProductCard";


const ProductDetailPage = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            if (productId) {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProduct(docSnap.data() as Product);
                }
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <Container className="my-5 text-center">Cargando producto...</Container>;
    }

    const handleAddToCart = () => {
        if (quantity > product.stock) {
            toast.error("La cantidad solicitada excede el stock disponible.");
            return;
        }
        addToCart({
            productId: productId!,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity,
        });
        toast.success("Producto agregado al carrito");
    };

    return (
        <Container className="my-5">
            <Row className="g-4">
                <Col md={6}>
                    <img src={product.image} alt={product.title} className="img-fluid" />
                </Col>
                <Col md={6}>
                    <h2>{product.title}</h2>
                    <p>{product.description}</p>
                    <h4>
                        {product.price.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                        })}
                    </h4>
                    <p>Stock disponible: {product.stock}</p>
                    <Form.Group className="mb-3" style={{ maxWidth: "120px" }}>
                        <Form.Label>Cantidad</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max={product.stock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                    </Form.Group>
                    <div className="d-flex align-items-center">
                        <AddToCartButton product={product} quantity={quantity} />
                        <div className="ms-3">
                            <FavoriteButton
                                product={product}
                            />
                        </div>
                    </div>
                    <br />
                    <Button variant="link" as={Link as any} to="/products">
                        Volver a Productos
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
