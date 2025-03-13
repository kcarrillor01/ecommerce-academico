import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Field, Form as FormikForm, ErrorMessage, FormikHelpers } from "formik";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ProductCard, { Product } from "../../components/ProductCard/ProductCard";
import * as Yup from "yup";

interface EditProductFormValues {
    title: string;
    description: string;
    image: string;
    price: string;
    stock: string;
    category: string;
    id?: string;
}

const validationSchema = Yup.object().shape({
    title: Yup.string().required("El título es obligatorio"),
    description: Yup.string().required("La descripción es obligatoria"),
    image: Yup.string().url("Debe ser una URL válida").required("La imagen es obligatoria"),
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

const EditProductPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!productId) return;
            setLoading(true);
            try {
                const productRef = doc(db, "products", productId);
                const productSnap = await getDoc(productRef);
                if (productSnap.exists()) {
                    setProduct({ id: productId, ...productSnap.data() } as Product);
                } else {
                    setError("Producto no encontrado.");
                }
            } catch (err) {
                console.error("Error al cargar el producto:", err);
                setError("Hubo un error al cargar el producto.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleSubmit = async (
        values: EditProductFormValues,
        { setSubmitting }: FormikHelpers<EditProductFormValues>
    ) => {
        if (!productId) return;
        setUpdating(true);
        try {
            const productRef = doc(db, "products", productId);
            // Extraemos el objeto sin id y convertimos price y stock a número
            const { id, price, stock, ...rest } = values;
            const updatedData = {
                ...rest,
                price: Number(price),
                stock: Number(stock),
            };
            await updateDoc(productRef, updatedData);
            navigate("/products");
        } catch (err) {
            console.error("Error al actualizar producto:", err);
            setError("Hubo un error al actualizar el producto.");
        } finally {
            setUpdating(false);
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;
    if (!product) return null;

    // Preparamos los valores iniciales para Formik, convirtiendo price y stock a string
    const initialFormValues: EditProductFormValues = {
        title: product.title,
        description: product.description,
        image: product.image,
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category,
        id: product.id,
    };

    return (
        <Container className="mt-4">
            <h2 className="text-center mb-4">Editar Producto</h2>
            <Row>
                {/* Columna de vista previa */}
                <Col md={6}>
                    <h3 className="text-center">Vista Previa</h3>
                    <ProductCard
                        product={{
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            image: product.image,
                            price: product.price,
                            stock: product.stock,
                            category: product.category,
                        }}
                        disable={true}
                    />
                </Col>

                {/* Columna del formulario de edición */}
                <Col md={6}>
                    <Formik
                        initialValues={initialFormValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                        enableReinitialize
                    >
                        {({ values, isSubmitting, isValid }) => (
                            <FormikForm>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <label>Nombre</label>
                                        <Field type="text" name="title" className="form-control" required />
                                        <ErrorMessage name="title" component="div" className="text-danger" />
                                    </Col>
                                    <Col md={12}>
                                        <label>Precio</label>
                                        <Field type="number" name="price" className="form-control" required />
                                        <ErrorMessage name="price" component="div" className="text-danger" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <label>Descripción</label>
                                        <Field as="textarea" name="description" className="form-control" rows={3} required />
                                        <ErrorMessage name="description" component="div" className="text-danger" />
                                    </Col>
                                    <Col md={12}>
                                        <label>Stock</label>
                                        <Field type="number" name="stock" className="form-control" required />
                                        <ErrorMessage name="stock" component="div" className="text-danger" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Col md={12}>
                                        <label>Imagen (URL)</label>
                                        <Field type="text" name="image" className="form-control" required />
                                        <ErrorMessage name="image" component="div" className="text-danger" />
                                    </Col>
                                    <Col md={12}>
                                        <label>Categoría</label>
                                        <Field type="text" name="category" className="form-control" required />
                                        <ErrorMessage name="category" component="div" className="text-danger" />
                                    </Col>
                                </Row>
                                <div className="text-center">
                                    <Button type="submit" variant="primary" className="mt-3" disabled={updating || isSubmitting || !isValid}>
                                        {updating || isSubmitting ? "Actualizando..." : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </FormikForm>
                        )}
                    </Formik>
                </Col>
            </Row>
        </Container>
    );
};

export default EditProductPage;
export { };
