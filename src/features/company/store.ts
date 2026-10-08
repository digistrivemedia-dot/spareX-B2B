import { create } from "zustand";
import { persist } from "zustand/middleware";

type BranchState = {
  /** The delivery branch chosen in the top bar. Null means the business's main branch. */
  selectedBranchId: string | null;
  selectBranch: (branchId: string) => void;
};

export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      selectedBranchId: null,
      selectBranch: (branchId) => set({ selectedBranchId: branchId }),
    }),
    // Rehydrated by StoreHydration after mount, so server and first client render match.
    { name: "sparex-branch", skipHydration: true },
  ),
);
