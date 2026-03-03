import { create } from "zustand";

export interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface WishlistState {
  items: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
}

function loadWishlist(): WishlistItem[] {
  try {
    const saved = localStorage.getItem("shopifyhub-wishlist");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveWishlist(items: WishlistItem[]) {
  try {
    localStorage.setItem("shopifyhub-wishlist", JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export const useWishlistStore = create<WishlistState>((set) => ({
  items: loadWishlist(),
  addToWishlist: (item) =>
    set((state) => {
      if (state.items.find((i) => i.id === item.id)) return state;
      const newItems = [...state.items, item];
      saveWishlist(newItems);
      return { items: newItems };
    }),
  removeFromWishlist: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      saveWishlist(newItems);
      return { items: newItems };
    }),
  clearWishlist: () => {
    saveWishlist([]);
    return { items: [] };
  },
}));
