import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export interface FavoriteProduct {
  id: string;
  title: string;
  image: string;
  price: number;
}

export const getFavorites = async (userId: string): Promise<FavoriteProduct[]> => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    return favSnap.data().products || [];
  }
  return [];
};

export const addFavorite = async (userId: string, product: FavoriteProduct) => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    // Actualizamos la lista, usando arrayUnion puede resultar problemático al remover luego
    // Por eso obtenemos la lista actual, agregamos el producto y re-escribimos
    const currentFavorites: FavoriteProduct[] = favSnap.data().products || [];
    // Evitamos duplicados
    const exists = currentFavorites.some((p) => p.id === product.id);
    if (!exists) {
      const updatedFavorites = [...currentFavorites, product];
      await updateDoc(favRef, { products: updatedFavorites });
    }
  } else {
    await setDoc(favRef, { products: [product] });
  }
};

export const removeFavorite = async (userId: string, productId: string) => {
  const favRef = doc(db, "favorites", userId);
  const favSnap = await getDoc(favRef);
  if (favSnap.exists()) {
    const currentFavorites: FavoriteProduct[] = favSnap.data().products || [];
    const updatedFavorites = currentFavorites.filter((p) => p.id !== productId);
    await updateDoc(favRef, { products: updatedFavorites });
  }
};
