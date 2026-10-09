"use client";

import { useEffect, useState } from "react";

import { getProductsById } from "@/features/catalog/api";
import type { Product } from "@/features/catalog/types";
import { useCartHasHydrated, useCartStore } from "@/features/cart/store";
import type { CartLine } from "@/features/cart/types";
import { getErrorMessage } from "@/lib/api-client";

type CartLinesState =
  | { status: "loading" | "empty" }
  | { status: "error"; message: string; retry: () => void }
  | { status: "ready"; lines: CartLine[] };

/**
 * The cart's items with their products. Only parts not fetched yet are requested, so changing
 * a quantity or removing a line never shows a loading state.
 */
export function useCartLines(): CartLinesState {
  const hasHydrated = useCartHasHydrated();
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  // null marks a part the catalogue no longer has.
  const [products, setProducts] = useState<ReadonlyMap<string, Product | null>>(new Map());
  const [failure, setFailure] = useState<{ ids: string; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);

  const missingIds = items
    .map((item) => item.productId)
    .filter((id) => !products.has(id))
    .sort()
    .join(",");

  useEffect(() => {
    if (!hasHydrated || !missingIds) return;
    const ids = missingIds.split(",");
    let isCurrent = true;
    getProductsById(ids).then(
      (found) => {
        if (!isCurrent) return;
        setProducts((known) => {
          const next = new Map(known);
          for (const id of ids) next.set(id, found.find((product) => product.id === id) ?? null);
          return next;
        });
        for (const id of ids) if (!found.some((product) => product.id === id)) removeItem(id);
      },
      (error) => isCurrent && setFailure({ ids: missingIds, message: getErrorMessage(error) }),
    );
    return () => {
      isCurrent = false;
    };
  }, [hasHydrated, missingIds, attempt, removeItem]);

  if (!hasHydrated) return { status: "loading" };
  if (items.length === 0) return { status: "empty" };
  if (missingIds && failure?.ids === missingIds) {
    return {
      status: "error",
      message: failure.message,
      retry: () => {
        setFailure(null);
        setAttempt((count) => count + 1);
      },
    };
  }
  if (missingIds) return { status: "loading" };

  return {
    status: "ready",
    lines: items.flatMap(({ productId, quantity }) => {
      const product = products.get(productId);
      return product ? [{ id: productId, product, quantity }] : [];
    }),
  };
}
