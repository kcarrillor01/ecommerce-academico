import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { emailService } from "../../services/emailService";

const CheckoutFlow: React.FC = () => {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const totalPrice = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const [shippingData, setShippingData] = useState({
        address: "",
        phone: "",
        email: "",
        name: "",
    });
    const [paymentMethod, setPaymentMethod] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleShippingSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!shippingData.address || !shippingData.phone || !shippingData.email) {
            toast.error("Todos los campos de envío son obligatorios");
            return;
        }
        setStep(2);
    };

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            toast.error("Selecciona un método de pago");
            return;
        }
        setStep(3);
    };

    const finalizeSale = async () => {
        if (loading) return;
        setLoading(true);
        try {
            // Actualizar stock de cada producto
            for (const item of cart) {
                const productRef = doc(db, "products", item.productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    const currentStock = productSnap.data().stock;
                    const newStock = currentStock - item.quantity;
                    if (newStock < 0) {
                        toast.error(`No hay suficiente stock para ${item.title}`);
                        setLoading(false);
                        return;
                    }
                    await updateDoc(productRef, { stock: newStock });
                } else {
                    toast.error(`El producto ${item.title} no existe.`);
                    setLoading(false);
                    return;
                }
            }

            // Registrar la venta en Firestore
            const saleRef = await addDoc(collection(db, "sales"), {
                items: cart,
                total: totalPrice,
                shippingData,
                paymentMethod,
                createdAt: new Date(),
                userId: user ? user.uid : null,
            });

            // Crear objeto orderDetails para el correo
            const orderDetails = {
                saleId: saleRef.id,
                items: cart,
                total: totalPrice,
            };

            // Enviar correo de confirmación
            await emailService(shippingData, orderDetails);

            clearCart();
            toast.success(
                `¡Compra realizada exitosamente! Se ha enviado la confirmación a ${shippingData.email}`
            );
            setStep(1);
        } catch (error) {
            console.error("Error al finalizar la compra", error);
            toast.error("Error al finalizar la compra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            {step === 1 && (
                <Form onSubmit={handleShippingSubmit}>
                    <h2 className="text-center mb-4">Datos de Envío</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                            type="text"
                            value={shippingData.address}
                            onChange={(e) =>
                                setShippingData({ ...shippingData, address: e.target.value })
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            value={shippingData.phone}
                            onChange={(e) =>
                                setShippingData({ ...shippingData, phone: e.target.value })
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            value={shippingData.email}
                            onChange={(e) =>
                                setShippingData({ ...shippingData, email: e.target.value })
                            }
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre (opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            value={shippingData.name}
                            onChange={(e) =>
                                setShippingData({ ...shippingData, name: e.target.value })
                            }
                        />
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            Continuar con el pago
                        </Button>
                    </div>
                </Form>
            )}

            {step === 2 && (
                <Form onSubmit={handlePaymentSubmit}>
                    <h2 className="text-center mb-4">Método de Pago</h2>
                    <Form.Group className="mb-3">
                        <Form.Label>Seleccione su método de pago</Form.Label>
                        <Form.Control
                            as="select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option value="credit-card">Tarjeta de Crédito</option>
                            <option value="debit-card">Tarjeta de Débito</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank-transfer">Transferencia Bancaria</option>
                        </Form.Control>
                    </Form.Group>
                    <div className="text-center">
                        <Button variant="primary" type="submit" disabled={loading}>
                            Continuar
                        </Button>
                    </div>
                </Form>
            )}

            {step === 3 && (
                <div className="text-center">
                    <h2 className="mb-4">Confirmación de Compra</h2>
                    <p>
                        Total a pagar:{" "}
                        {totalPrice.toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                        })}
                    </p>
                    <p>Método de pago: {paymentMethod}</p>
                    <Button variant="success" onClick={finalizeSale} disabled={loading}>
                        {loading ? "Procesando..." : "Finalizar Compra"}
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default CheckoutFlow;
