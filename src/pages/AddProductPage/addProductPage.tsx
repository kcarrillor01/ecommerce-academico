import React from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Formik, Field, Form as FormikForm, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import ProductCard, { Product } from "../../components/ProductCard/ProductCard";

// Define la interfaz para los valores del formulario
interface ProductFormValues {
    title: string;
    description: string;
    image: string;
    price: string;
    stock: string;
    category: string;
}

const initialValues: ProductFormValues = {
    title: "",
    description: "",
    image: "",
    price: "",
    stock: "",
    category: "",
};

const validationSchema = Yup.object().shape({
    title: Yup.string().required("El título es obligatorio"),
    description: Yup.string().required("La descripción es obligatoria"),
    image: Yup.string()
        .url("Debe ser una URL válida")
        .required("La imagen es obligatoria"),
    price: Yup.number()
        .typeError("El precio debe ser un número")
        .required("El precio es obligatorio")
        .positive("El precio debe ser positivo"),
    stock: Yup.number()
        .typeError("El stock debe ser un número")
        .required("El stock es obligatorio")
        .min(0, "El stock no puede ser negativo"),
    category: Yup.string().required("La categoría es obligatoria"),
});

const AddProductPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (
        values: ProductFormValues,
        { setSubmitting, resetForm }: FormikHelpers<ProductFormValues>
    ) => {
        try {
            await addDoc(collection(db, "products"), {
                title: values.title,
                description: values.description,
                image: values.image,
                price: Number(values.price),
                stock: Number(values.stock),
                category: values.category,
            });
            toast.success("Producto agregado correctamente");
            resetForm();
            navigate("/products");
        } catch (error) {
            console.error("Error al agregar producto:", error);
            toast.error("Error al agregar producto");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Añadir Producto</h2>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting, isValid }) => (
                    <Row>
                        {/* Columna del formulario */}
                        <Col md={6}>
                            <FormikForm className="mt-4">
                                <Form.Group className="mb-3">
                                    <Form.Label>Título</Form.Label>
                                    <Field name="title" className="form-control" placeholder="Ingresa el título" />
                                    <div className="text-danger">
                                        <ErrorMessage name="title" />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción</Form.Label>
                                    <Field
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        className="form-control"
                                        placeholder="Ingresa la descripción"
                                    />
                                    <div className="text-danger">
                                        <ErrorMessage name="description" />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Imagen (URL)</Form.Label>
                                    <Field name="image" className="form-control" placeholder="Ingresa la URL de la imagen" />
                                    <div className="text-danger">
                                        <ErrorMessage name="image" />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Precio</Form.Label>
                                    <Field
                                        name="price"
                                        type="number"
                                        className="form-control"
                                        placeholder="Ingresa el precio"
                                    />
                                    <div className="text-danger">
                                        <ErrorMessage name="price" />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Stock</Form.Label>
                                    <Field
                                        name="stock"
                                        type="number"
                                        className="form-control"
                                        placeholder="Ingresa el stock disponible"
                                    />
                                    <div className="text-danger">
                                        <ErrorMessage name="stock" />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría</Form.Label>
                                    <Field as="select" name="category" className="form-control">
                                        <option value="">Seleccione una categoría</option>
                                        <option value="Juegos de Mesa">Juegos de Mesa</option>
                                        <option value="Cartas">Cartas</option>
                                        <option value="Accesorios">Accesorios</option>
                                    </Field>
                                    <div className="text-danger">
                                        <ErrorMessage name="category" />
                                    </div>
                                </Form.Group>

                                <div className="text-center">
                                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Agregando..." : "Añadir Producto"}
                                    </Button>
                                </div>
                            </FormikForm>
                        </Col>

                        {/* Columna de vista previa */}
                        <Col md={6}>
                            <h3 className="text-center">Vista Previa</h3>
                            <div className="preview-container">
                                <ProductCard
                                    product={{
                                        id: "preview",
                                        title: values.title || "Título de ejemplo",
                                        description: values.description || "Descripción de ejemplo",
                                        image: values.image || "https://via.placeholder.com/400x300?text=Imagen+de+producto",
                                        price: Number(values.price) || 0,
                                        stock: Number(values.stock) || 0,
                                        category: values.category || "Categoría",
                                    }}
                                    disable={true}
                                />
                            </div>
                        </Col>
                    </Row>
                )}
            </Formik>
        </Container>
    );
};

export default AddProductPage;
