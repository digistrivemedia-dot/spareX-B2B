"use client";

import { StockStatus } from "@/features/catalog/components/StockStatus";
import type { Product } from "@/features/catalog/types";
import { getStockAtBranch } from "@/features/catalog/utils";
import { useBranches } from "@/features/company/components/BranchesProvider";
import { useSelectedBranch } from "@/features/company/use-selected-branch";

/** Stock for every branch of the business, with the current delivery branch marked. */
export function BranchAvailability({ product }: { product: Product }) {
  const branches = useBranches();
  const selected = useSelectedBranch();

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
      {branches.map((branch) => (
        <li key={branch.id} className="flex items-center justify-between gap-3 px-3 py-2">
          <span className="text-gray-700">
            {branch.name}
            {branch.id === selected?.id && (
              <span className="text-xs text-gray-500"> · delivering here</span>
            )}
          </span>
          <StockStatus quantity={getStockAtBranch(product, branch.id)} />
        </li>
      ))}
    </ul>
  );
}
