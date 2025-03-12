import React from "react";
import { Button } from "react-bootstrap";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Product } from "../ProductCard/ProductCard";

interface AddToCartButtonProps {
    product: Product;
    quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ product, quantity }) => {
    const { user } = useAuth();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!user) {
            toast.error("Debes iniciar sesión para agregar productos al carrito");
            return;
        }
        addToCart({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
        });
        toast.success("Producto agregado al carrito");
    };

    return (
        <Button variant="primary" onClick={handleAddToCart}>
            Añadir al carrito
        </Button>
    );
};

export default AddToCartButton;
