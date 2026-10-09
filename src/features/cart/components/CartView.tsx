"use client";

import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { FormAlert } from "@/components/ui/FormAlert";
import { getStockAtBranch } from "@/features/catalog/utils";
import { CartLinesFallback } from "@/features/cart/components/CartLinesFallback";
import { cartColumns } from "@/features/cart/components/columns";
import { OrderSummaryCard } from "@/features/cart/components/OrderSummaryCard";
import { useCartStore } from "@/features/cart/store";
import { useCartLines } from "@/features/cart/use-cart-lines";
import { getCartIssue, toPricedLine } from "@/features/cart/utils";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { formatCount } from "@/lib/format";
import { calculateOrderTotals } from "@/lib/pricing";

export function CartView() {
  const state = useCartLines();
  const branch = useSelectedBranch();
  const items = useCartStore((store) => store.items);
  const clear = useCartStore((store) => store.clear);
  const addItem = useCartStore((store) => store.addItem);

  if (state.status !== "ready") return <CartLinesFallback state={state} />;

  const { lines } = state;
  const totals = calculateOrderTotals(lines.map(toPricedLine));
  const blockingCount = lines.filter(
    (line) =>
      getCartIssue(line, branch ? getStockAtBranch(line.product, branch.id) : 0)?.isBlocking,
  ).length;
  const quotationItems = lines.map((line) => `${line.id}:${line.quantity}`).join(",");

  function handleClear() {
    const saved = [...items];
    clear();
    toast("Cart cleared", {
      action: {
        label: "Undo",
        onClick: () => saved.forEach((item) => addItem(item.productId, item.quantity)),
      },
    });
  }

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <section aria-label="Cart items" className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
          <span>
            {formatCount(lines.length, "item")} · delivering to{" "}
            <span className="font-medium text-gray-900">{branch?.name}</span>
          </span>
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear cart
          </Button>
        </div>
        <DataTable label="Cart items" columns={cartColumns} data={lines} emptyState={null} />
      </section>

      <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
        <OrderSummaryCard totals={totals} itemCount={lines.length}>
          {blockingCount > 0 && (
            <FormAlert
              message={`Fix ${formatCount(blockingCount, "line")} marked in red before checking out.`}
            />
          )}
          {blockingCount > 0 ? (
            <Button size="lg" disabled>
              Proceed to checkout
            </Button>
          ) : (
            <Button size="lg" asChild>
              <Link href="/checkout">
                Proceed to checkout
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/quotations/new?items=${encodeURIComponent(quotationItems)}`}>
              <FileText aria-hidden />
              Save as quotation request
            </Link>
          </Button>
        </OrderSummaryCard>
      </aside>
    </div>
  );
}
