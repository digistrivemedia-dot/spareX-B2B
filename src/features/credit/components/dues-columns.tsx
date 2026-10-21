"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { DueCountdown } from "@/features/credit/components/DueCountdown";
import { PayInvoiceButton } from "@/features/credit/components/PayInvoiceButton";
import type { Invoice } from "@/features/credit/types";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<Invoice>();

export const dueColumns = column.columns([
  column.accessor("number", {
    header: "Invoice no.",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex flex-col">
        <a
          href={row.original.pdfUrl}
          download
          className="font-medium text-navy-700 hover:underline"
        >
          {row.original.number}
        </a>
        {row.original.order && (
          <span className="text-xs text-gray-500">{row.original.order.number}</span>
        )}
      </span>
    ),
  }),
  column.accessor("issuedAt", {
    header: "Invoice date",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("dueDate", {
    header: "Due date",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("balanceInPaise", {
    header: "Amount due (incl. GST)",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="flex flex-col items-end">
        <span className="font-semibold text-gray-900">
          {formatPrice(row.original.balanceInPaise)}
        </span>
        {row.original.balanceInPaise < row.original.amountInPaise && (
          <span className="text-xs text-gray-500">
            of {formatPrice(row.original.amountInPaise)}
          </span>
        )}
      </span>
    ),
  }),
  column.display({
    id: "days",
    header: "Days",
    cell: ({ row }) => <DueCountdown invoice={row.original} />,
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <PayInvoiceButton invoice={row.original} />,
  }),
]);
