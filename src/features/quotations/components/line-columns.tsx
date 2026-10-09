"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import type { QuotationLine } from "@/features/quotations/types";
import { getDiscountPercent } from "@/features/quotations/utils";
import { formatNumber, formatPrice } from "@/lib/format";

/** A quotation line keyed by its product, as the DataTable needs an id. */
export type QuotationLineRow = QuotationLine & { id: string };

const column = createAppColumnHelper<QuotationLineRow>();

export const quotationLineColumns = column.columns([
  column.accessor("name", {
    header: "Part",
    meta: { isCardTitle: true },
    cell: ({ row }) => (
      <div className="flex max-w-72 flex-col gap-0.5 whitespace-normal">
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
  column.accessor("listPriceInPaise", {
    header: "Your price",
    meta: { align: "right" },
    cell: ({ getValue }) => formatPrice(getValue()),
  }),
  column.accessor("quotedPriceInPaise", {
    header: "Quoted price",
    meta: { align: "right" },
    cell: ({ getValue }) => {
      const quoted = getValue();
      return quoted === undefined ? (
        <span className="text-gray-500">Pending</span>
      ) : (
        <span className="font-semibold text-gray-900">{formatPrice(quoted)}</span>
      );
    },
  }),
  column.display({
    id: "discount",
    header: "Discount",
    meta: { align: "right" },
    cell: ({ row }) => {
      const discount = getDiscountPercent(row.original);
      if (discount === null) return "—";
      return (
        <span className={discount > 0 ? "font-medium text-success-700" : undefined}>
          {discount}%
        </span>
      );
    },
  }),
  column.display({
    id: "lineTotal",
    header: "Line total",
    meta: { align: "right" },
    cell: ({ row }) => {
      const { quotedPriceInPaise, quantity } = row.original;
      return quotedPriceInPaise === undefined ? (
        "—"
      ) : (
        <span className="font-semibold text-gray-900">
          {formatPrice(quotedPriceInPaise * quantity)}
        </span>
      );
    },
  }),
]);
