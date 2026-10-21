"use client";

import Link from "next/link";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OrderPaymentStatus } from "@/features/orders/components/OrderPaymentStatus";
import { ReorderButton } from "@/features/orders/components/ReorderButton";
import type { OrderSummary } from "@/features/orders/types";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<OrderSummary>();

const number = column.accessor("number", {
  header: "Order no.",
  enableHiding: false,
  meta: { isCardTitle: true },
  cell: ({ row }) => (
    <Link href={`/orders/${row.original.id}`} className="font-medium text-navy-700 hover:underline">
      {row.original.number}
    </Link>
  ),
});
const poNumber = column.accessor("poNumber", {
  header: "PO no.",
  cell: ({ getValue }) => getValue() ?? "—",
});
const branch = column.accessor((order) => order.branch.name, { id: "branch", header: "Branch" });
const items = column.accessor("itemCount", { header: "Items", meta: { align: "right" } });
const status = column.accessor("status", {
  header: "Status",
  cell: ({ getValue }) => <StatusBadge status={getValue()} />,
});
const amountCell = ({ getValue }: { getValue: () => number }) => (
  <span className="font-semibold text-gray-900">{formatPrice(getValue())}</span>
);
const dateCell = ({ getValue }: { getValue: () => string }) => formatDate(getValue());

/** The dashboard's short list: newest first, no sorting. */
export const orderColumns = column.columns([
  number,
  poNumber,
  column.accessor("placedAt", { header: "Date", cell: dateCell }),
  branch,
  items,
  column.accessor("totalInPaise", {
    header: "Amount (incl. GST)",
    meta: { align: "right" },
    cell: amountCell,
  }),
  status,
]);

/** The full orders list: sortable by date and amount, with payment and a reorder button. */
export const orderListColumns = column.columns([
  number,
  poNumber,
  column.accessor("placedAt", { header: "Date", enableSorting: true, cell: dateCell }),
  branch,
  items,
  column.accessor("totalInPaise", {
    header: "Amount (incl. GST)",
    enableSorting: true,
    meta: { align: "right" },
    cell: amountCell,
  }),
  column.accessor("payment", {
    header: "Payment",
    cell: ({ getValue }) => <OrderPaymentStatus payment={getValue()} />,
  }),
  status,
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    enableHiding: false,
    cell: ({ row }) =>
      row.original.status !== "cancelled" && (
        <ReorderButton
          variant="ghost"
          size="icon-sm"
          orderId={row.original.id}
          orderNumber={row.original.number}
          title="Reorder"
        >
          <span className="sr-only">Reorder {row.original.number}</span>
        </ReorderButton>
      ),
  }),
]);
