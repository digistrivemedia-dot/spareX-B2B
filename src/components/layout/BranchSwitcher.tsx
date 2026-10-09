"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranchStore } from "@/features/company/store";
import type { Branch } from "@/features/company/types";
import { useSelectedBranch } from "@/features/company/use-selected-branch";

type BranchSwitcherProps = {
  branches: Branch[];
};

/** Chooses the delivery branch used for stock and checkout. */
export function BranchSwitcher({ branches }: BranchSwitcherProps) {
  const selectBranch = useBranchStore((state) => state.selectBranch);
  const selected = useSelectedBranch(branches);

  if (!selected) return null;

  function handleChange(branchId: string) {
    const branch = branches.find((candidate) => candidate.id === branchId);
    if (!branch) return;
    selectBranch(branch.id);
    toast.success(`Delivering to ${branch.name}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" aria-label={`Delivery branch: ${selected.name}`}>
          <MapPin aria-hidden className="text-navy-700" />
          <span className="hidden flex-col items-start leading-tight lg:flex">
            <span className="text-xs font-normal text-gray-500">Deliver to</span>
            <span className="text-sm font-medium text-gray-900">{selected.name}</span>
          </span>
          <ChevronDown aria-hidden className="hidden text-gray-400 lg:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Delivery branch</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={selected.id} onValueChange={handleChange}>
            {branches.map((branch) => (
              <DropdownMenuRadioItem key={branch.id} value={branch.id} className="items-start">
                <span className="flex flex-col">
                  <span className="font-medium text-gray-900">
                    {branch.name}
                    {branch.isMain && <span className="font-normal text-gray-500"> · Main</span>}
                  </span>
                  <span className="text-xs text-gray-500">
                    {branch.address.line1}, {branch.address.pin}
                  </span>
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
