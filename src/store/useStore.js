import { create } from "zustand";

export const useStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),

    cart: [],
    addToCart: (item) => set((state) => ({ cart: [...state.cart, item] })),
    clearCart: () => set({ cart: [] }),
}));
