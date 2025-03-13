import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Devuelve un array de IDs de productos favoritos
export const getFavorites = async (userId: string): Promise<string[]> => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    return favSnap.data().productIds || [];
  }
  return [];
};

// Agrega el ID del producto a los favoritos, evitando duplicados
export const addFavorite = async (userId: string, productId: string) => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    const currentFavorites: string[] = favSnap.data().productIds || [];
    if (!currentFavorites.includes(productId)) {
      const updatedFavorites = [...currentFavorites, productId];
      await updateDoc(favRef, { productIds: updatedFavorites });
    }
  } else {
    await setDoc(favRef, { productIds: [productId] });
  }
};

// Elimina el ID del producto de la lista de favoritos
export const removeFavorite = async (userId: string, productId: string) => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    const currentFavorites: string[] = favSnap.data().productIds || [];
    const updatedFavorites = currentFavorites.filter((id) => id !== productId);
    await updateDoc(favRef, { productIds: updatedFavorites });
  }
};
