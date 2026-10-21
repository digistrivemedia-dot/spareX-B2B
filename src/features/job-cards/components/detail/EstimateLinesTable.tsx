"use client";

import { ReceiptText } from "lucide-react";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { EstimateLine, LineApproval } from "@/features/job-cards/types";
import { ESTIMATE_KIND_LABELS } from "@/features/job-cards/utils";
import { formatNumber, formatPrice } from "@/lib/format";

const APPROVAL_STATUS = {
  pending: "awaiting_approval",
  approved: "approved",
  rejected: "rejected",
} as const satisfies Record<LineApproval, string>;

const column = createAppColumnHelper<EstimateLine>();

const columns = column.columns([
  column.accessor("description", {
    header: "Item",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <span className="flex max-w-80 flex-col gap-0.5 whitespace-normal">
        <span className="font-medium text-gray-900">{row.original.description}</span>
        <span className="text-xs text-gray-500">
          {ESTIMATE_KIND_LABELS[row.original.kind]}
          {row.original.partNumber && ` · ${row.original.partNumber}`}
          {row.original.isExtra && " · Extra work"}
        </span>
      </span>
    ),
  }),
  column.accessor("quantity", {
    header: "Qty",
    meta: { align: "right" },
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  column.accessor("unitPriceInPaise", {
    header: "Price (excl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => formatPrice(getValue()),
  }),
  column.display({
    id: "lineTotal",
    header: "Total",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
        {formatPrice(row.original.unitPriceInPaise * row.original.quantity)}
      </span>
    ),
  }),
  column.accessor("approval", {
    header: "Customer",
    cell: ({ getValue }) => <StatusBadge status={APPROVAL_STATUS[getValue()]} />,
  }),
]);

export function EstimateLinesTable({ lines }: { lines: EstimateLine[] }) {
  return (
    <DataTable
      label="Estimate"
      columns={columns}
      data={lines}
      density="compact"
      emptyState={<EmptyState icon={ReceiptText} title="Nothing on the estimate yet" />}
    />
  );
}
