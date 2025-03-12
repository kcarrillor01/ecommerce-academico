import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

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
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="h-100">
      <Card.Img variant="top" src={product.image} alt={product.title} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>
          Precio: ${product.price.toFixed(2)} <br />
          Stock: {product.stock}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Button variant="primary" as={Link as any} to={`/product/${product.id}`}>
            Ver Detalle
          </Button>
          <FavoriteButton
            product={{
              id: product.id,
              title: product.title,
              image: product.image,
              price: product.price,
            }}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
