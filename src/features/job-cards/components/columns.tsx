"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { JobCardSummary } from "@/features/job-cards/types";
import { formatDateTime, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<JobCardSummary>();

export const jobColumns = column.columns([
  column.accessor("number", {
    header: "Job no.",
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex flex-col">
        <Link
          href={`/garage/jobs/${row.original.id}`}
          className="font-medium text-navy-700 hover:underline"
        >
          {row.original.number}
        </Link>
        <span className="text-xs text-gray-500">
          {row.original.source === "walk_in" ? "Walk-in" : "Booking"}
        </span>
      </span>
    ),
  }),
  column.accessor("vehicle", {
    header: "Vehicle",
    cell: ({ getValue }) => (
      <span className="flex flex-col items-end gap-1 @3xl:items-start">
        <NumberPlate plate={getValue().plate} />
        <span className="text-xs text-gray-500">
          {getValue().make} {getValue().model}
        </span>
      </span>
    ),
  }),
  column.accessor((job) => job.customer.name, { id: "customer", header: "Customer" }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
  column.accessor((job) => job.technician?.name ?? "—", { id: "technician", header: "Technician" }),
  column.accessor((job) => job.branch.name, { id: "branch", header: "Branch" }),
  column.accessor("createdAt", {
    header: "Opened",
    enableSorting: true,
    cell: ({ getValue }) => formatDateTime(getValue()),
  }),
  column.accessor("amountInPaise", {
    header: "Amount (incl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const amount = getValue();
      return amount === undefined ? (
        <span className="text-gray-500">—</span>
      ) : (
        <span className="font-semibold text-gray-900">{formatPrice(amount)}</span>
      );
    },
  }),
]);
