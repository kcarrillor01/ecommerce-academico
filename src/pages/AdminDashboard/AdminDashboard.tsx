import React, { useEffect, useState } from "react";
import { Container, Tabs, Tab, Table, Button } from "react-bootstrap";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Form } from "react-bootstrap";

interface UserData {
    uid: string;
    name: string;
    email: string;
    rol: string;
}

interface ProductData {
    id: string;
    title: string;
    stock: number;
    // Otros campos que desees mostrar
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [products, setProducts] = useState<ProductData[]>([]);

    // Obtener usuarios de Firestore (asumiendo que están en la colección "users")
    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersData: UserData[] = querySnapshot.docs.map((doc) => ({
                uid: doc.id,
                ...doc.data(),
            })) as UserData[];
            setUsers(usersData);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Error al obtener usuarios");
        }
    };

    // Obtener productos de Firestore
    const fetchProducts = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "products"));
            const productsData: ProductData[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as ProductData[];
            setProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Error al obtener productos");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchProducts();
    }, []);

    // Función para cambiar el rol de un usuario de "cliente" a "admin"
    const toggleUserRole = async (uid: string, currentRole: string) => {
        try {
            const newRole = currentRole === "cliente" ? "admin" : "cliente";
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, { rol: newRole });
            toast.success(`Rol actualizado a ${newRole}`);
            fetchUsers(); // Vuelve a cargar la lista de usuarios para reflejar el cambio
        } catch (error) {
            console.error("Error al cambiar rol:", error);
            toast.error("Error al actualizar el rol del usuario");
        }
    };



    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Administración</h2>
            <Tabs defaultActiveKey="usuarios" id="admin-tabs" className="mb-3">
                <Tab eventKey="usuarios" title="Usuarios">
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>UID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.uid}>
                                    <td>{u.uid}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.rol}</td>
                                    <td>
                                        <Form.Check
                                            type="switch"
                                            id={`switch-${u.uid}`}
                                            label={u.rol === "admin" ? "Admin" : "Cliente"}
                                            checked={u.rol === "admin"}
                                            onChange={() => toggleUserRole(u.uid, u.rol)}
                                        />
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="productos" title="Productos">
                    <div className="d-flex justify-content-between mb-3">
                        <Button variant="success" as={Link as any} to="/add-product">
                            Añadir Producto
                        </Button>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Título</th>
                                <th>Stock</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>
                                    <td>{p.stock}</td>
                                    <td>
                                        <Button variant="info" as={Link as any} to={`/edit-product/${p.id}`}>
                                            Editar
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>
        </Container>
    );
};

export default AdminDashboard;
