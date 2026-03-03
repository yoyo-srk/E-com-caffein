import { create } from "zustand";

interface UIState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (val: boolean) => void;
}

const savedTheme = localStorage.getItem("shopifyhub-theme");

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: savedTheme === "dark",
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      localStorage.setItem("shopifyhub-theme", next ? "dark" : "light");
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDarkMode: next };
    }),
  setDarkMode: (val) =>
    set(() => {
      localStorage.setItem("shopifyhub-theme", val ? "dark" : "light");
      if (val) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDarkMode: val };
    }),
}));
