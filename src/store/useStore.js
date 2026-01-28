import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useStore = create(
    persist(
        (set, get) => ({
            // --- Autenticación de Usuario ---
            user: null,
            setUser: (userData) => set({ user: userData }),
            logout: () => set({ user: null, cart: [] }),

            //carrito de compras
            cart: [],
            addToCart: (product) => {
                const currentCart = get().cart;
                const existingProduct = currentCart.find((item) => item.id === product.id);

                if (existingProduct) {
                    const updatedCart = currentCart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item
                    );
                    set({ cart: updatedCart });
                } else {
                    set({ cart: [...currentCart, { ...product, quantity: 1 }] });
                }
            },

            decreaseQuantity: (productId) => {
                const currentCart = get().cart;
                const product = currentCart.find((item) => item.id === productId);

                if (!product) return;

                if (product.quantity > 1) {
                    const updatedCart = currentCart.map((item) =>
                        item.id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                    set({ cart: updatedCart });
                } else {
                    set({ cart: currentCart.filter((item) => item.id !== productId) });
                }
            },


            removeFromCart: (productId) => {
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== productId),
                }));
            },

            clearCart: () => set({ cart: [] }),

            getTotal: () => {
                const currentCart = get().cart;
                return currentCart.reduce(
                    (total, item) => total + item.price * (item.quantity || 1),
                    0
                );
            },
        }),
        {
            name: "cineplanet-storage", //storage name
        }
    )
);
