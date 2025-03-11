import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithGoogle } from "../firebase";

const Login = () => {
    const { user, logout } = useAuth();

    const handleLogin = async () => {
        try {
            const loggedInUser = await signInWithGoogle();
            if (loggedInUser) {
                toast.success(`Bienvenido, ${loggedInUser.displayName}`);
            }
        } catch (error) {
            toast.error("Error al iniciar sesión.");
        }
    };

    return (
        <div className="container text-center mt-5">
            {user ? (
                <>
                    <h3>Hola, {user.displayName}</h3>
                    <img src={user.photoURL} alt="Avatar" className="rounded-circle" width="50" />
                    <br />
                    <button className="btn btn-danger mt-3" onClick={logout}>
                        Cerrar sesión
                    </button>
                </>
            ) : (
                <button className="btn btn-primary" onClick={handleLogin}>
                    Iniciar sesión con Google
                </button>
            )}
            <ToastContainer />
        </div>
    );
};

export default Login;
