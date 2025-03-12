import { CartItem } from "../context/CartContext";

// Función para agregar un producto al carrito
export const addToCartService = (
  cart: CartItem[],
  newItem: CartItem
): CartItem[] => {
  // Verifica si el producto ya existe en el carrito
  const existingItem = cart.find(
    (item) => item.productId === newItem.productId
  );
  if (existingItem) {
    // Si ya existe, aumenta la cantidad
    return cart.map((item) =>
      item.productId === newItem.productId
        ? { ...item, quantity: item.quantity + newItem.quantity }
        : item
    );
  } else {
    // Sino, lo agrega al carrito
    return [...cart, newItem];
  }
};
