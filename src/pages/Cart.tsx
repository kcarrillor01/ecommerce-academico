import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

function Cart() {
    const { cart, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();

    // Calcular el total de la compra
    const totalPrice = cart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        try {
            // Iterar por cada item en el carrito para actualizar stock
            for (const item of cart) {
                const productRef = doc(db, "products", item.productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    const currentStock = productSnap.data().stock;
                    const newStock = currentStock - item.quantity;
                    if (newStock < 0) {
                        toast.error(`No hay suficiente stock para ${item.title}`);
                        return;
                    }
                    await updateDoc(productRef, { stock: newStock });
                } else {
                    toast.error(`El producto ${item.title} no existe.`);
                    return;
                }
            }

            // Registrar la venta en la colección "sales"
            await addDoc(collection(db, "sales"), {
                items: cart, // Guarda los items del carrito (puedes formatearlo si lo prefieres)
                total: totalPrice,
                createdAt: new Date(),
                userId: user ? user.uid : null, // Si el usuario está autenticado, guarda su ID
            });

            clearCart();
            toast.success("¡Compra realizada exitosamente!");
        } catch (error) {
            console.error("Error al finalizar la compra", error);
            toast.error("Error al finalizar la compra");
        }
    };

    if (cart.length === 0) {
        return (
            <Container className="my-5 text-center">
                <h2>Tu carrito está vacío</h2>
                <Button variant="primary" as={Link as any} to="/products">
                    Ver Productos
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">Tu Carrito</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item) => (
                        <tr key={item.productId}>
                            <td>{item.title}</td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.quantity}</td>
                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                            <td>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => removeFromCart(item.productId)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={3} className="text-end">
                            <strong>Total:</strong>
                        </td>
                        <td colSpan={2}>
                            <strong>${totalPrice.toFixed(2)}</strong>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <div className="text-center">
                <Button variant="success" onClick={handleCheckout}>
                    Finalizar Compra
                </Button>
            </div>
        </Container>
    );
}

export default Cart;
