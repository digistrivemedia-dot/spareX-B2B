"use client";

import { PackageOpen } from "lucide-react";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import type { ReturnLine } from "@/features/returns/types";
import { formatNumber, formatPrice } from "@/lib/format";

type ReturnLineRow = ReturnLine & { id: string };

const column = createAppColumnHelper<ReturnLineRow>();

const columns = column.columns([
  column.accessor("name", {
    header: "Part",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <div className="flex max-w-80 flex-col gap-0.5 whitespace-normal">
        <span className="font-medium text-gray-900">{row.original.name}</span>
        <span className="text-xs text-gray-500">{row.original.partNumber}</span>
      </div>
    ),
  }),
  column.accessor("quantity", {
    header: "Qty",
    meta: { align: "right" },
    cell: ({ getValue }) => formatNumber(getValue()),
  }),
  column.accessor("unitPriceInPaise", {
    header: "Unit price (excl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => formatPrice(getValue()),
  }),
  column.display({
    id: "lineTotal",
    header: "Line total",
    meta: { align: "right" },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900">
        {formatPrice(row.original.unitPriceInPaise * row.original.quantity)}
      </span>
    ),
  }),
]);

export function ReturnItemsTable({ items }: { items: ReturnLine[] }) {
  return (
    <DataTable
      label="Parts being returned"
      columns={columns}
      data={items.map((line) => ({ ...line, id: line.productId }))}
      density="compact"
      emptyState={<EmptyState icon={PackageOpen} title="No parts on this return" />}
    />
  );
}
