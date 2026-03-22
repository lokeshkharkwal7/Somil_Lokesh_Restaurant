import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Each cart entry:
  // { cartId, item, selectedModifiers: { [groupId]: modifier | modifier[] }, quantity, unitPrice }
  const [cart, setCart] = useState([]);

  // Unique key = item._id + sorted modifier _ids
  const buildCartId = (itemId, selectedModifiers) => {
    const modPart = Object.values(selectedModifiers)
      .flat()
      .map((m) => m._id)
      .sort()
      .join("_");
    return `${itemId}__${modPart}`;
  };

  // Base price + sum of all chosen modifier prices
  const computeUnitPrice = (item, selectedModifiers) => {
    const modTotal = Object.values(selectedModifiers)
      .flat()
      .reduce((sum, m) => sum + (m.price || 0), 0);
    return item.price + modTotal;
  };

  const addToCart = (item, selectedModifiers = {}) => {
    const cartId = buildCartId(item._id, selectedModifiers);
    const unitPrice = computeUnitPrice(item, selectedModifiers);
    setCart((prev) => {
      const existing = prev.find((e) => e.cartId === cartId);
      if (existing) {
        return prev.map((e) =>
          e.cartId === cartId ? { ...e, quantity: e.quantity + 1 } : e
        );
      }
      return [...prev, { cartId, item, selectedModifiers, quantity: 1, unitPrice }];
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.cartId === cartId);
      if (existing && existing.quantity > 1) {
        return prev.map((e) =>
          e.cartId === cartId ? { ...e, quantity: e.quantity - 1 } : e
        );
      }
      return prev.filter((e) => e.cartId !== cartId);
    });
  };

  const deleteFromCart = (cartId) => {
    setCart((prev) => prev.filter((e) => e.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const getQuantity = (itemId, selectedModifiers = {}) => {
    const cartId = buildCartId(itemId, selectedModifiers);
    return cart.find((e) => e.cartId === cartId)?.quantity || 0;
  };

  const getItemTotalQuantity = (itemId) =>
    cart.filter((e) => e.item._id === itemId).reduce((sum, e) => sum + e.quantity, 0);

  const totalItems = cart.reduce((sum, e) => sum + e.quantity, 0);
  const totalPrice = cart.reduce((sum, e) => sum + e.unitPrice * e.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        getQuantity,
        getItemTotalQuantity,
        totalItems,
        totalPrice,
        buildCartId,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}