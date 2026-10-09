import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartItem } from "@/features/cart/types";

type CartState = {
  items: CartItem[];
  /** Adds to the quantity already in the cart for this product. */
  addItem: (productId: string, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, quantity) =>
        set(({ items }) => {
          const existing = items.find((item) => item.productId === productId);
          if (!existing) return { items: [...items, { productId, quantity }] };
          return {
            items: items.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
            ),
          };
        }),
      setQuantity: (productId, quantity) =>
        set(({ items }) => ({
          items: items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),
      removeItem: (productId) =>
        set(({ items }) => ({ items: items.filter((item) => item.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    // Rehydrated by StoreHydration after mount, so server and first client render match.
    { name: "sparex-cart", skipHydration: true },
  ),
);

/** False until the saved cart has been read from the browser, so pages don't flash "empty". */
export function useCartHasHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCartStore.persist.onFinishHydration(onChange),
    () => useCartStore.persist.hasHydrated(),
    () => false,
  );
}
