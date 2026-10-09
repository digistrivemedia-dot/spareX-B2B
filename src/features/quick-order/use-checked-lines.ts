"use client";

import { getStockAtBranch } from "@/features/catalog/utils";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import type { CheckedLine, OrderLineDraft } from "@/features/quick-order/types";
import { checkLine } from "@/features/quick-order/utils";

/** Each row with its stock at the delivery branch and how it checks out. */
export function useCheckedLines(lines: OrderLineDraft[]): CheckedLine[] {
  const branch = useSelectedBranch();
  return lines.map((line) => {
    const stock = line.product && branch ? getStockAtBranch(line.product, branch.id) : 0;
    return { line, stock, check: checkLine(line, stock) };
  });
}
