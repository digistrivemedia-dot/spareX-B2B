"use client";

import { useBranches } from "@/features/company/components/BranchesProvider";
import { useBranchStore } from "@/features/company/store";
import type { Branch } from "@/features/company/types";

/** The delivery branch chosen in the top bar, falling back to the main branch. */
export function useSelectedBranch(): Branch | undefined {
  const branches = useBranches();
  const selectedBranchId = useBranchStore((state) => state.selectedBranchId);
  return (
    branches.find((branch) => branch.id === selectedBranchId) ??
    branches.find((branch) => branch.isMain) ??
    branches[0]
  );
}
