"use client";

import { useEffect } from "react";

import { useCartStore } from "@/features/cart/store";
import { useBranchStore } from "@/features/company/store";

/**
 * Loads the persisted cart and branch from localStorage after the first render.
 * Reading them during render would make the server HTML and the first client render differ.
 */
export function StoreHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useBranchStore.persist.rehydrate();
  }, []);

  return null;
}
