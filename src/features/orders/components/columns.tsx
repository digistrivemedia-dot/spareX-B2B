"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderSummary } from "@/features/orders/types";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<OrderSummary>();

export const orderColumns = column.columns([
  column.accessor("number", {
    header: "Order no.",
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <Link
        href={`/orders/${row.original.id}`}
        className="font-medium text-navy-700 hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  }),
  column.accessor("poNumber", {
    header: "PO no.",
    cell: ({ getValue }) => getValue() ?? "—",
  }),
  column.accessor("placedAt", {
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor((order) => order.branch.name, {
    id: "branch",
    header: "Branch",
  }),
  column.accessor("itemCount", {
    header: "Items",
    meta: { align: "right" },
  }),
  column.accessor("totalInPaise", {
    header: "Amount (incl. GST)",
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
