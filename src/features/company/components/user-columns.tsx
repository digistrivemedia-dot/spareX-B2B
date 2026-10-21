"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ROLE_LABELS } from "@/features/auth/roles";
import { useBranches } from "@/features/company/components/BranchesProvider";
import type { CompanyUser } from "@/features/company/types";
import { formatPhone } from "@/lib/format";

const column = createAppColumnHelper<CompanyUser>();

function BranchName({ branchId }: { branchId: string }) {
  return useBranches().find((branch) => branch.id === branchId)?.name ?? "—";
}

export const userColumns = column.columns([
  column.accessor("name", {
    header: "Name",
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex flex-col">
        <Link
          href={`/company/users/${row.original.id}`}
          className="font-medium text-navy-700 hover:underline"
        >
          {row.original.name}
        </Link>
        <span className="text-xs text-gray-500">{row.original.email}</span>
      </span>
    ),
  }),
  column.accessor("phone", {
    header: "Mobile",
    cell: ({ getValue }) => formatPhone(getValue()),
  }),
  column.accessor("roles", {
    header: "Roles",
    cell: ({ getValue }) => (
      <span className="flex flex-wrap justify-end gap-1 @3xl:justify-start">
        {getValue().map((role) => (
          <span
            key={role}
            className="rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-navy-800"
          >
            {ROLE_LABELS[role]}
          </span>
        ))}
      </span>
    ),
  }),
  column.accessor("branchId", {
    header: "Branch",
    cell: ({ getValue }) => <BranchName branchId={getValue()} />,
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
]);
