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
        if (product.stock === 0) {
            toast.error("Producto sin stock");
            return;
        }
        if (quantity > product.stock) {
            toast.error("La cantidad solicitada excede el stock disponible");
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
        <Button
            variant="warning"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || quantity <= 0}
        >
            {product.stock === 0 ? "Sin stock" : "Añadir al carrito"}
        </Button>
    );
};

export default AddToCartButton;
