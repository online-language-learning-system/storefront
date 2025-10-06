import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage when entering the app
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    // notify listeners in same tab
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  // Update localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    // notify listeners (e.g., navbar) to refresh count in same tab
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // Keep context state in sync when other parts update localStorage directly
  useEffect(() => {
    const syncFromStorage = () => {
      const saved = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(saved);
    };
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("cartUpdated", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("cartUpdated", syncFromStorage);
    };
  }, []);

  // Add item to cart
  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((c) => c.id === item.id);
      if (exist) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity } : c))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
