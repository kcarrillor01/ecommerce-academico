import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";

interface SaleItem {
    image: string;
    title: string;
    price: number;
    quantity: number;
}

interface Sale {
    id: string;
    createdAt: any;
    total: number;
    items: SaleItem[];
    shippingData: {
        address: string;
        phone: string;
        email: string;
        name?: string;
    };
    paymentMethod: string;
}

const MyPurchases: React.FC = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSales = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const q = query(
                    collection(db, "sales"),
                    where("userId", "==", user.uid)
                );
                const querySnapshot = await getDocs(q);
                const salesData: Sale[] = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Sale[];
                setSales(salesData);
            } catch (error) {
                console.error("Error fetching sales:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [user]);

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Mis Compras</h2>
            {loading ? (
                <p>Cargando compras...</p>
            ) : sales.length === 0 ? (
                <p>No tienes compras registradas.</p>
            ) : (
                <Row>
                    {sales.map((sale) => (
                        <Col md={6} key={sale.id} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>
                                        Compra realizada el{" "}
                                        {new Date(sale.createdAt.seconds * 1000).toLocaleString()}
                                    </Card.Title>
                                    <Card.Text>
                                        <strong>Total:</strong>{" "}
                                        {sale.total.toLocaleString("es-CO", {
                                            style: "currency",
                                            currency: "COP",
                                        })}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Método de pago:</strong> {sale.paymentMethod}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Dirección de envío:</strong> {sale.shippingData.address}
                                        <br />
                                        <strong>Teléfono:</strong> {sale.shippingData.phone}
                                        <br />
                                        <strong>Correo:</strong> {sale.shippingData.email}
                                    </Card.Text>
                                    <Card.Text>
                                        <strong>Productos:</strong>
                                        <ul>
                                            {sale.items.map((item, index) => (
                                                <li key={index}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        width="40"
                                                        className="me-2"
                                                    />
                                                    {item.title} ({item.quantity} x{" "}
                                                    {item.price.toLocaleString("es-CO", {
                                                        style: "currency",
                                                        currency: "COP",
                                                    })})
                                                </li>
                                            ))}
                                        </ul>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default MyPurchases;
