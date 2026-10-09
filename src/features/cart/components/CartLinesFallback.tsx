"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTableSkeleton } from "@/components/ui/data-table/DataTableSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { useCartLines } from "@/features/cart/use-cart-lines";

type CartLinesFallbackProps = {
  /** Any state of the cart except "ready". */
  state: Exclude<ReturnType<typeof useCartLines>, { status: "ready" }>;
};

/** What the cart and checkout show while the cart loads, when it is empty, or if loading failed. */
export function CartLinesFallback({ state }: CartLinesFallbackProps) {
  if (state.status === "loading") return <DataTableSkeleton columns={5} rows={3} />;

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      {state.status === "error" ? (
        <ErrorState title="We couldn't load your cart" onRetry={state.retry} />
      ) : (
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Add parts from the catalogue, or type part numbers into a quick order."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" asChild>
                <Link href="/catalog">Browse the catalogue</Link>
              </Button>
              <Button asChild>
                <Link href="/quick-order">Quick order</Link>
              </Button>
            </div>
          }
        />
      )}
    </div>
  );
}
