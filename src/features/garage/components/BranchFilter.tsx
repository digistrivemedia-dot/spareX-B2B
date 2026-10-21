import { FilterSelect } from "@/components/ui/FilterSelect";
import type { Branch } from "@/features/company/types";

/** Owners choose a branch to look at; staff only ever see their own, so they get no filter. */
export function BranchFilter({ branches, canChoose }: { branches: Branch[]; canChoose: boolean }) {
  if (!canChoose) return null;
  return (
    <FilterSelect
      param="branch"
      label="Branch"
      allLabel="All branches"
      options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
    />
  );
}
