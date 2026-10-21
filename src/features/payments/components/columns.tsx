"use client";

import { ReceiptText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Payment } from "@/features/payments/types";
import { describeMethod, hasReceipt, targetHref } from "@/features/payments/utils";
import { formatDateTime, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<Payment>();

export const paymentColumns = column.columns([
  column.accessor("date", {
    header: "Date",
    enableSorting: true,
    meta: { isCardTitle: true },
    cell: ({ getValue }) => formatDateTime(getValue()),
  }),
  column.accessor("method", {
    header: "Method",
    cell: ({ row }) => (
      <span className="flex flex-col">
        <span>{describeMethod(row.original)}</span>
        {row.original.reference && (
          <span className="text-xs break-all text-gray-500">{row.original.reference}</span>
        )}
      </span>
    ),
  }),
  column.accessor("appliedTo", {
    header: "For",
    cell: ({ getValue }) => (
      <span className="flex flex-col">
        {getValue().map((target) => (
          <Link key={target.id} href={targetHref(target)} className="text-navy-700 hover:underline">
            {target.number}
          </Link>
        ))}
      </span>
    ),
  }),
  column.accessor("amountInPaise", {
    header: "Amount",
    meta: { align: "right" },
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">{formatPrice(getValue())}</span>
    ),
  }),
  column.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Receipt</span>,
    cell: ({ row }) =>
      hasReceipt(row.original) && (
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/payments/${row.original.id}/receipt`}>
            <ReceiptText aria-hidden />
            Receipt
          </Link>
        </Button>
      ),
  }),
]);
