"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BranchFormDialog } from "@/features/company/components/BranchFormDialog";
import type { GarageBranch } from "@/features/garage/types";
import { formatPhone } from "@/lib/format";

const column = createAppColumnHelper<GarageBranch>();

export const branchColumns = column.columns([
  column.accessor("name", {
    header: "Branch",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex flex-wrap items-center gap-2 font-medium text-gray-900">
        {row.original.name}
        {row.original.isMain && <StatusBadge status="active">Main</StatusBadge>}
      </span>
    ),
  }),
  column.accessor("address", {
    header: "Address",
    cell: ({ getValue }) => {
      const address = getValue();
      return (
        <span className="block max-w-72 whitespace-normal">
          {[address.line1, address.line2, address.city].filter(Boolean).join(", ")} {address.pin}
        </span>
      );
    },
  }),
  column.accessor("contactName", {
    header: "Contact",
    cell: ({ row }) => (
      <span className="flex flex-col">
        {row.original.contactName}
        <span className="text-xs text-gray-500">{formatPhone(row.original.contactPhone)}</span>
      </span>
    ),
  }),
  column.accessor("staffCount", {
    header: "Staff",
    meta: { align: "right" },
    cell: ({ row }) => (
      <Link
        href={`/company/users?branch=${row.original.id}`}
        className="font-medium text-navy-700 hover:underline"
      >
        {row.original.staffCount}
      </Link>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <BranchFormDialog
        branch={row.original}
        trigger={
          <Button variant="ghost" size="sm" aria-label={`Edit ${row.original.name}`}>
            <Pencil aria-hidden />
            Edit
          </Button>
        }
      />
    ),
  }),
]);
