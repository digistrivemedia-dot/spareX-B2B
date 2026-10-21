"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import type { StatementEntry } from "@/features/credit/types";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<StatementEntry>();

const TYPE_LABELS = { invoice: "Invoice", payment: "Payment", credit_note: "Credit note" };

const amount = (paise: number) =>
  paise ? <span className="font-medium text-gray-900">{formatPrice(paise)}</span> : "—";

export const statementColumns = column.columns([
  column.accessor("date", {
    header: "Date",
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("reference", {
    header: "Reference",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex max-w-80 flex-col gap-0.5 whitespace-normal">
        <span className="font-medium text-gray-900">
          {TYPE_LABELS[row.original.type]} · {row.original.reference}
        </span>
        <span className="text-xs text-gray-500">{row.original.description}</span>
      </span>
    ),
  }),
  column.accessor("debitInPaise", {
    header: "Debit",
    meta: { align: "right" },
    cell: ({ getValue }) => amount(getValue()),
  }),
  column.accessor("creditInPaise", {
    header: "Credit",
    meta: { align: "right" },
    cell: ({ getValue }) => amount(getValue()),
  }),
  column.accessor("balanceInPaise", {
    header: "Balance",
    meta: { align: "right" },
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">{formatPrice(getValue())}</span>
    ),
  }),
]);
