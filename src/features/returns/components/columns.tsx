"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { ReturnSummary } from "@/features/returns/types";
import { RETURN_REASON_LABELS } from "@/features/returns/utils";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<ReturnSummary>();

export const returnColumns = column.columns([
  column.accessor("number", {
    header: "Return no.",
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <Link
        href={`/returns/${row.original.id}`}
        className="font-medium text-navy-700 hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  }),
  column.accessor((row) => row.order.number, {
    id: "order",
    header: "Order no.",
    cell: ({ row }) => (
      <Link href={`/orders/${row.original.order.id}`} className="text-navy-700 hover:underline">
        {row.original.order.number}
      </Link>
    ),
  }),
  column.accessor("requestedAt", {
    header: "Requested on",
    enableSorting: true,
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("reason", {
    header: "Reason",
    cell: ({ getValue }) => RETURN_REASON_LABELS[getValue()],
  }),
  column.accessor("itemCount", { header: "Items", meta: { align: "right" } }),
  column.accessor("refundInPaise", {
    header: "Refund (incl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">{formatPrice(getValue())}</span>
    ),
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
]);
