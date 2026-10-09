"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import { BranchStockStatus } from "@/features/catalog/components/BranchStockStatus";
import { PackAddToCart } from "@/features/catalog/components/PackAddToCart";
import { ProductPrice } from "@/features/catalog/components/ProductPrice";
import { ProductSummary } from "@/features/catalog/components/ProductSummary";
import type { Product } from "@/features/catalog/types";

const column = createAppColumnHelper<Product>();

export const catalogColumns = column.columns([
  column.accessor("name", {
    header: "Part",
    enableSorting: true,
    enableHiding: false,
    meta: { isCardTitle: true },
    cell: ({ row }) => <ProductSummary product={row.original} />,
  }),
  column.display({
    id: "stock",
    header: "Stock",
    cell: ({ row }) => <BranchStockStatus product={row.original} />,
  }),
  // The id matches the API's `sort=price`, so header sorting and the sort menu agree.
  column.accessor("businessPriceInPaise", {
    id: "price",
    header: "Your price",
    enableSorting: true,
    meta: { align: "right" },
    cell: ({ row }) => <ProductPrice product={row.original} align="end" />,
  }),
  column.display({
    id: "actions",
    header: "Quantity",
    cell: ({ row }) => <PackAddToCart product={row.original} />,
  }),
]);
