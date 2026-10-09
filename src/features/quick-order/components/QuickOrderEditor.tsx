"use client";

import { useRouter } from "next/navigation";
import type { KeyboardEvent } from "react";
import { toast } from "sonner";

import { getStockAtBranch, getUnitPrice } from "@/features/catalog/utils";
import { useCartStore } from "@/features/cart/store";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { OrderLineList } from "@/features/quick-order/components/OrderLineList";
import { PasteListPanel } from "@/features/quick-order/components/PasteListPanel";
import { QuickOrderFooter } from "@/features/quick-order/components/QuickOrderFooter";
import { useOrderLines } from "@/features/quick-order/use-order-lines";
import { checkLine } from "@/features/quick-order/utils";
import { formatCount } from "@/lib/format";
import { summarisePricing } from "@/lib/pricing";

/** Type or paste part numbers, check them against stock, then send them to the cart. */
export function QuickOrderEditor() {
  const router = useRouter();
  const branch = useSelectedBranch();
  const addItem = useCartStore((state) => state.addItem);
  const lines = useOrderLines();

  const checked = lines.lines.map((line) => {
    const stock = line.product && branch ? getStockAtBranch(line.product, branch.id) : 0;
    return { line, stock, check: checkLine(line, stock) };
  });
  // Rows the cart can take: a part was found and the branch has some stock.
  const addable = checked.flatMap(({ line, check }) =>
    line.product && check && check.status !== "out_of_stock"
      ? [{ ...line, product: line.product }]
      : [],
  );
  const problemCount = checked.filter(
    ({ check }) => check?.status === "not_found" || check?.status === "out_of_stock",
  ).length;

  const { subtotalInPaise } = summarisePricing(
    addable.map(({ product, quantity }) => ({
      quantity,
      unitPriceInPaise: getUnitPrice(product, quantity),
      listPriceInPaise: product.businessPriceInPaise,
      gstRatePercent: product.gstRatePercent,
    })),
  );

  const quotationItems = checked
    .flatMap(({ line }) => (line.product ? [`${line.product.id}:${line.quantity}`] : []))
    .join(",");

  function handleAddAll() {
    if (addable.length === 0) return;
    for (const { product, quantity } of addable) addItem(product.id, quantity);
    lines.removeLines(addable.map((line) => line.id));
    toast.success(`${formatCount(addable.length, "item")} added to cart`, {
      description: problemCount ? "Rows that need attention are still here." : undefined,
      action: { label: "View cart", onClick: () => router.push("/cart") },
    });
  }

  // Ctrl+Enter (Cmd+Enter on a Mac) from anywhere in the order: add everything to the cart.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" || !(event.ctrlKey || event.metaKey)) return;
    event.preventDefault();
    handleAddAll();
  }

  return (
    <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
      <PasteListPanel onLinesReady={lines.appendLines} />
      <OrderLineList state={lines} checkedLines={checked} />
      <QuickOrderFooter
        lineCount={addable.length}
        subtotalInPaise={subtotalInPaise}
        problemCount={problemCount}
        quotationHref={`/quotations/new?items=${encodeURIComponent(quotationItems)}`}
        onAddAll={handleAddAll}
      />
    </div>
  );
}
