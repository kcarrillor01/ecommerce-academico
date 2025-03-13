import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk3z6cWKXrUVp69hDrMI4vb1Ey7T02eqU",
  authDomain: "eccomerce-academico.firebaseapp.com",
  projectId: "eccomerce-academico",
  storageBucket: "eccomerce-academico.firebasestorage.app",
  messagingSenderId: "367733258440",
  appId: "1:367733258440:web:89dcec05330d14db87cdfd",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// Fuerza la selección de cuenta cada vez que se inicia sesión:
provider.setCustomParameters({
  prompt: "select_account",
});
export const db = getFirestore(app); // Exporta la variable db

// Función para iniciar sesión con Google y guardar usuario en Firestore
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Guarda el usuario en Firestore
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        rol: "cliente",
      });
    }

    return user;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
};

// Función para cerrar sesión
export const logout = async () => {
  await signOut(auth);
};
