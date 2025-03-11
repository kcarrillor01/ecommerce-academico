import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";

const AddProductPage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [category, setCategory] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !description || !image || !price || !stock || !category) {
            toast.error("Todos los campos son obligatorios");
            return;
        }

        try {
            await addDoc(collection(db, "products"), {
                title,
                description,
                image,
                price: Number(price),
                stock: Number(stock),
                category,
            });
            toast.success("Producto agregado correctamente");
            navigate("/products");
        } catch (error) {
            console.error("Error al agregar producto:", error);
            toast.error("Error al agregar producto");
        }
    };

    return (
        <Container className="my-5">
            <h1 className="text-center">Añadir Producto</h1>
            <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3">
                    <Form.Label>Título</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa el título"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Ingresa la descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Imagen (URL)</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Ingresa la URL de la imagen"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingresa el precio"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingresa el stock disponible"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Seleccione una categoría</option>
                        <option value="Juegos de Mesa">Juegos de Mesa</option>
                        <option value="Cartas">Cartas</option>
                        <option value="Accesorios">Accesorios</option>
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Añadir Producto
                </Button>
            </Form>
        </Container>
    );
};

export default AddProductPage;
