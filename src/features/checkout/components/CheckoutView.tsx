"use client";

import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { getStockAtBranch } from "@/features/catalog/utils";
import { CartLinesFallback } from "@/features/cart/components/CartLinesFallback";
import { useCartStore } from "@/features/cart/store";
import { useCartLines } from "@/features/cart/use-cart-lines";
import { getCartIssue, toPricedLine } from "@/features/cart/utils";
import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import type { CreditSummary } from "@/features/credit/types";
import type { PlacedOrder } from "@/features/orders/types";
import { calculateOrderTotals } from "@/lib/pricing";

/** `credit` is null when credit isn't enabled for this business. */
export function CheckoutView({ credit }: { credit: CreditSummary | null }) {
  const router = useRouter();
  const state = useCartLines();
  const branch = useSelectedBranch();
  const clearCart = useCartStore((store) => store.clear);
  const [placed, setPlaced] = useState<PlacedOrder | null>(null);

  function handlePlaced(order: PlacedOrder) {
    // Show the confirmation first, so emptying the cart never flashes "Your cart is empty".
    setPlaced(order);
    router.push(`/checkout/success?order=${order.id}`);
    clearCart();
  }

  if (placed) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={CircleCheck}
          title={`${placed.number} placed`}
          description="Opening your order…"
        />
      </div>
    );
  }
  if (state.status !== "ready" || !branch) {
    return <CartLinesFallback state={state.status === "ready" ? { status: "loading" } : state} />;
  }

  const { lines } = state;
  const blockingCount = lines.filter(
    (line) => getCartIssue(line, getStockAtBranch(line.product, branch.id))?.isBlocking,
  ).length;

  return (
    <CheckoutForm
      lines={lines}
      totals={calculateOrderTotals(lines.map(toPricedLine))}
      credit={credit}
      branchId={branch.id}
      blockingCount={blockingCount}
      onPlaced={handlePlaced}
    />
  );
}
