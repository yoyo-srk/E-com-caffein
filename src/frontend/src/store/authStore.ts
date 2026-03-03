import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  ordersCount: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

function loadAuth(): { isAuthenticated: boolean; user: User | null } {
  try {
    const saved = localStorage.getItem("shopifyhub-auth");
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

function saveAuth(state: { isAuthenticated: boolean; user: User | null }) {
  try {
    localStorage.setItem("shopifyhub-auth", JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

const initialAuth = loadAuth();

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: initialAuth.isAuthenticated,
  user: initialAuth.user,
  login: (email, name) => {
    const user: User = {
      id: "user-001",
      name: name || email.split("@")[0],
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      ordersCount: 12,
    };
    saveAuth({ isAuthenticated: true, user });
    set({ isAuthenticated: true, user });
  },
  logout: () => {
    saveAuth({ isAuthenticated: false, user: null });
    set({ isAuthenticated: false, user: null });
  },
  updateUser: (data) =>
    set((state) => {
      if (!state.user) return state;
      const user = { ...state.user, ...data };
      saveAuth({ isAuthenticated: state.isAuthenticated, user });
      return { user };
    }),
}));
