import React from "react";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./NavigationBar.css";

function NavigationBar() {
    const { user, login, logout } = useAuth();
    console.log(user?.photoURL);


    return (
        <Navbar sticky="top" className="navbar-custom" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src="/favicon.ico"
                        alt="Logo"
                        style={{ width: "40px", height: "40px", marginRight: "10px", objectFit: "cover" }}
                    />
                    Dices & Boards
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/products">Productos</Nav.Link>
                        {user && <Nav.Link as={Link} to="/cart">Carrito</Nav.Link>}
                        {user && user.rol === "admin" && (
                            <Nav.Link as={Link} to="/admin">Administrar</Nav.Link>
                        )}
                        {user ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle variant="link" id="dropdown-basic" style={{ padding: 0 }}>
                                    <img
                                        src={"/default-user.jpg"}
                                        alt="Avatar"
                                        className="rounded-circle"
                                        crossOrigin="anonymous"
                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />

                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={logout}>Salir</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button variant="success" onClick={login} className="ms-3">
                                Iniciar Sesión
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
