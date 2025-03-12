import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteButton from "../FavoriteButton/FavoriteButton";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import "./ProductCard.css";

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onToggleFavorite?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onToggleFavorite }) => {
  return (
    <Card className="h-100 product-card">
      <Card.Img
        variant="top"
        src={product.image}
        alt={product.title}
        className="product-card-img"
      />
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-0 product-card-title">
            {product.title}
          </Card.Title>
          <FavoriteButton
            product={product}
            onToggle={onToggleFavorite}
          />
        </div>
        <Card.Text className="mt-2 product-card-text">
          Precio:{" "}
          {product.price.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
          <br />
          Stock: {product.stock}
        </Card.Text>
        <div className="mt-auto product-card-buttons">
          <div className="d-flex justify-content-around">
            <Button variant="primary" as={Link as any} to={`/product/${product.id}`}>
              Ver Detalle
            </Button>
            <AddToCartButton product={product} quantity={1} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
