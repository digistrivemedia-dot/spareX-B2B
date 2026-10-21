"use client";

import { MapPinned } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { branchColumns } from "@/features/garage/components/branch-columns";
import type { GarageBranch } from "@/features/garage/types";

export function BranchesTable({ branches }: { branches: GarageBranch[] }) {
  return (
    <DataTable
      label="Branches"
      columns={branchColumns}
      data={branches}
      emptyState={<EmptyState icon={MapPinned} title="No branches yet" />}
    />
  );
}
