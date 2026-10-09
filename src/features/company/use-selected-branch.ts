"use client";

import { useBranchStore } from "@/features/company/store";
import type { Branch } from "@/features/company/types";

/** The delivery branch chosen in the top bar, falling back to the main branch. */
export function useSelectedBranch(branches: Branch[]): Branch | undefined {
  const selectedBranchId = useBranchStore((state) => state.selectedBranchId);
  return (
    branches.find((branch) => branch.id === selectedBranchId) ??
    branches.find((branch) => branch.isMain) ??
    branches[0]
  );
}
