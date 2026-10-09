"use client";

import { StockStatus } from "@/features/catalog/components/StockStatus";
import type { Product } from "@/features/catalog/types";
import { useBranchStock } from "@/features/catalog/use-branch-stock";

/** Stock for the delivery branch chosen in the top bar. */
export function BranchStockStatus({ product }: { product: Pick<Product, "stockByBranch"> }) {
  return <StockStatus quantity={useBranchStock(product)} />;
}
