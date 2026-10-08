"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";

/** Cart link with the number of different parts in the cart. */
export function CartButton() {
  const lineCount = useCartStore((state) => state.items.length);
  const label = lineCount === 1 ? "Cart, 1 item" : `Cart, ${lineCount} items`;

  return (
    <Button variant="ghost" size="icon" className="relative" asChild>
      <Link href="/cart" aria-label={label}>
        <ShoppingCart aria-hidden />
        {lineCount > 0 && (
          <span
            aria-hidden
            className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-700 px-1 text-xs leading-none font-semibold text-white tabular-nums"
          >
            {lineCount}
          </span>
        )}
      </Link>
    </Button>
  );
}
