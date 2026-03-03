import { create } from "zustand";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem("shopifyhub-cart");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  try {
    localStorage.setItem("shopifyhub-cart", JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export const useCartStore = create<CartState>((set) => ({
  items: loadCart(),
  addToCart: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i,
        );
      } else {
        newItems = [...state.items, { ...item, quantity: item.quantity ?? 1 }];
      }
      saveCart(newItems);
      return { items: newItems };
    }),
  removeFromCart: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      saveCart(newItems);
      return { items: newItems };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i,
      );
      saveCart(newItems);
      return { items: newItems };
    }),
  clearCart: () => {
    saveCart([]);
    return { items: [] };
  },
}));
