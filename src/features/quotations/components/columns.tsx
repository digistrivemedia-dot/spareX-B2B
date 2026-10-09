"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { QuotationSummary } from "@/features/quotations/types";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<QuotationSummary>();

export const quotationColumns = column.columns([
  column.accessor("number", {
    header: "Quote no.",
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <Link
        href={`/quotations/${row.original.id}`}
        className="font-medium text-navy-700 hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  }),
  column.accessor("requestedAt", {
    header: "Requested on",
    enableSorting: true,
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("itemCount", {
    header: "Items",
    meta: { align: "right" },
  }),
  column.accessor("totalInPaise", {
    header: "Quoted (incl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const total = getValue();
      return total === undefined ? (
        <span className="text-gray-500">Awaiting quote</span>
      ) : (
        <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
      );
    },
  }),
  column.accessor("validUntil", {
    header: "Valid until",
    enableSorting: true,
    cell: ({ getValue }) => {
      const validUntil = getValue();
      return validUntil ? formatDate(validUntil) : "—";
    },
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
]);
