import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { addFavorite, removeFavorite, getFavorites, } from "../../services/favoritesServices";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Product } from "../ProductCard/ProductCard";

interface FavoriteButtonProps {
    product: Product;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ product }) => {
    const { user } = useAuth();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavorites = async () => {
            if (user) {
                const favs = await getFavorites(user.uid);
                const exists = favs.some((p) => p.id === product.id);
                setIsFavorite(exists);
            }
        };
        fetchFavorites();
    }, [user, product.id]);

    const handleFavorite = async () => {
        if (!user) {
            toast.error("Debes iniciar sesión para guardar favoritos");
            return;
        }
        if (isFavorite) {
            await removeFavorite(user.uid, product.id);
            setIsFavorite(false);
            toast.info("Producto removido de favoritos");
        } else {
            await addFavorite(user.uid, product);
            setIsFavorite(true);
            toast.success("Producto agregado a favoritos");
        }
    };

    return (
        <Button
            variant="link"
            onClick={handleFavorite}
            style={{
                fontSize: "1.5rem",
                color: isFavorite ? "red" : "gray",
                alignSelf: "flex-start", // Forzar alineación al inicio
            }}
        >
            <i className={isFavorite ? "fa fa-heart" : "fa fa-heart-o"} />
        </Button>
    );
};

export default FavoriteButton;
