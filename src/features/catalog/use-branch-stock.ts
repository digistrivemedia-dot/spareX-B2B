"use client";

import type { Product } from "@/features/catalog/types";
import { getStockAtBranch } from "@/features/catalog/utils";
import { useSelectedBranch } from "@/features/company/use-selected-branch";

/** Units of this product available for the selected delivery branch. */
export function useBranchStock(product: Pick<Product, "stockByBranch">): number {
  const branch = useSelectedBranch();
  return branch ? getStockAtBranch(product, branch.id) : 0;
}
