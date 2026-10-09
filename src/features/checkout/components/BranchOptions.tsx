"use client";

import { MapPin } from "lucide-react";

import { RadioGroup } from "@/components/ui/radio-group";
import { ChoiceCard } from "@/features/checkout/components/ChoiceCard";
import { useBranches } from "@/features/company/components/BranchesProvider";
import { useBranchStore } from "@/features/company/store";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { formatPhone } from "@/lib/format";

/**
 * Where the whole order goes. This is the same choice as the top bar's delivery branch, so
 * changing it in either place updates both, along with every stock warning.
 */
export function BranchOptions() {
  const branches = useBranches();
  const selected = useSelectedBranch();
  const selectBranch = useBranchStore((state) => state.selectBranch);

  return (
    <RadioGroup
      aria-label="Delivery branch"
      value={selected?.id}
      onValueChange={selectBranch}
      className="grid gap-3 sm:grid-cols-2"
    >
      {branches.map((branch) => (
        <ChoiceCard
          key={branch.id}
          id={`branch-${branch.id}`}
          value={branch.id}
          title={branch.isMain ? `${branch.name} (main)` : branch.name}
          icon={MapPin}
        >
          <p>
            {[branch.address.line1, branch.address.line2, branch.address.city].join(", ")}{" "}
            {branch.address.pin}
          </p>
          <p className="text-xs text-gray-500">
            {branch.contactName} · {formatPhone(branch.contactPhone)}
          </p>
        </ChoiceCard>
      ))}
    </RadioGroup>
  );
}
