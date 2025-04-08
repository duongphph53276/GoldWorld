import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Iproduct } from "../../interfaces/product";

interface CartItem {
  id: number; // id của item trong API
  product: Iproduct;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Iproduct) => void;
  removeFromCart: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const API_URL = "http://localhost:3000/cart";

  // Load cart từ API khi app mở
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error("Lỗi tải giỏ hàng:", err));
  }, []);

  const addToCart = async (product: Iproduct) => {
    const existing = cartItems.find((item) => item.product.id === product.id);
    if (existing) {
      // Update quantity
      updateQuantity(existing.id, existing.quantity + 1);
    } else {
      const newItem = { product, quantity: 1 };
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      const savedItem = await res.json();
      setCartItems((prev) => [...prev, savedItem]);
    }
  };

  const updateQuantity = async (id: number | string, quantity: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    });

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = async (id: number | string) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
