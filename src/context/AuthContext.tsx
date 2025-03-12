import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase"; // Asegúrate de que esta función esté definida en firebase.ts

interface AuthContextProps {
    user: any;
    login: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const token = await currentUser.getIdToken(true);
                localStorage.setItem("authToken", token);
                setUser(currentUser);
            } else {
                setUser(null);
                localStorage.removeItem("authToken");
            }
        });

        const checkTokenChanges = () => {
            const storedToken = localStorage.getItem("authToken");
            if (!storedToken) {
                signOut(auth);
            }
        };

        window.addEventListener("storage", checkTokenChanges);

        return () => {
            unsubscribe();
            window.removeEventListener("storage", checkTokenChanges);
        };
    }, [auth, navigate]);

    const login = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Error al iniciar sesión", error);
        }
    };

    const logout = async () => {
        await signOut(auth);
        localStorage.removeItem("authToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
