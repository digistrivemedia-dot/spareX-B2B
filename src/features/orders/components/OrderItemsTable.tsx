"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { DataTable } from "@/components/ui/data-table/DataTable";
import type { OrderLine } from "@/features/orders/types";
import { formatNumber, formatPrice } from "@/lib/format";

/** An order line keyed by its product, as the DataTable needs an id. */
type OrderLineRow = OrderLine & { id: string };

const column = createAppColumnHelper<OrderLineRow>();

const columns = column.columns([
  column.accessor("name", {
    header: "Part",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <div className="flex max-w-80 flex-col gap-0.5 whitespace-normal">
        <span className="font-medium text-gray-900">{row.original.name}</span>
        <span className="text-xs text-gray-500">
          {row.original.partNumber} · {row.original.brand}
        </span>
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
    cell: ({ row }) => {
      const { unitPriceInPaise, listPriceInPaise } = row.original;
      return (
        <span className="flex flex-col items-end">
          {formatPrice(unitPriceInPaise)}
          {unitPriceInPaise < listPriceInPaise && (
            <s className="text-xs text-gray-500">{formatPrice(listPriceInPaise)}</s>
          )}
        </span>
      );
    },
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

export function OrderItemsTable({ items }: { items: OrderLine[] }) {
  return (
    <DataTable
      label="Order items"
      columns={columns}
      data={items.map((line) => ({ ...line, id: line.productId }))}
      emptyState={null}
      density="compact"
    />
  );
}
