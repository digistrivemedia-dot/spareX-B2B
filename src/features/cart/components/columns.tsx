"use client";

import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import {
  CartLineTotal,
  CartQuantity,
  CartUnitPrice,
  RemoveFromCartButton,
} from "@/features/cart/components/CartLineCells";
import { CartLinePart } from "@/features/cart/components/CartLinePart";
import type { CartLine } from "@/features/cart/types";

const column = createAppColumnHelper<CartLine>();

export const cartColumns = column.columns([
  column.display({
    id: "part",
    header: "Part",
    meta: { isCardTitle: true },
    cell: ({ row }) => <CartLinePart line={row.original} />,
  }),
  column.display({
    id: "unitPrice",
    header: "Unit price (excl. GST)",
    meta: { align: "right" },
    cell: ({ row }) => <CartUnitPrice line={row.original} />,
  }),
  column.display({
    id: "quantity",
    header: "Quantity",
    cell: ({ row }) => <CartQuantity line={row.original} />,
  }),
  column.display({
    id: "lineTotal",
    header: "Line total",
    meta: { align: "right" },
    cell: ({ row }) => <CartLineTotal line={row.original} />,
  }),
  column.display({
    id: "actions",
    header: "",
    cell: ({ row }) => <RemoveFromCartButton line={row.original} />,
  }),
]);
