import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase";
import { db } from "../firebase"; // O donde hayas definido la interfaz

export interface User {
    uid: string;
    name: string;
    email: string;
    photoURL: string;
    rol: string;
    createdAt: Date | string; // Puede ser un objeto Date o un string formateado
}

interface AuthContextProps {
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRef = doc(db, "users", currentUser.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    // Asumimos que los datos del documento cumplen la interfaz User
                    setUser(userSnap.data() as User);
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const login = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error("Error al iniciar sesión", error);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
