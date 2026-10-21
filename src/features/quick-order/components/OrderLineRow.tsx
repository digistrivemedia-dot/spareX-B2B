"use client";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { StockStatus } from "@/features/catalog/components/StockStatus";
import type { Product } from "@/features/catalog/types";
import { getPackLabel } from "@/features/catalog/utils";
import { LINE_COLUMNS } from "@/features/quick-order/components/line-columns";
import { LineStatusNote } from "@/features/quick-order/components/LineStatusNote";
import { PartNumberInput } from "@/features/quick-order/components/PartNumberInput";
import type { LineCheck, OrderLineDraft } from "@/features/quick-order/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type OrderLineRowProps = {
  line: OrderLineDraft;
  position: number;
  stock: number;
  check: LineCheck | null;
  onQueryChange: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuantityChange: (quantity: number) => void;
  /** Enter in the quantity box: go to the next row. */
  onNext: () => void;
  onRemove: () => void;
};

export function OrderLineRow({
  line,
  position,
  stock,
  check,
  onQueryChange,
  onSelectProduct,
  onQuantityChange,
  onNext,
  onRemove,
}: OrderLineRowProps) {
  const { product } = line;
  const unitPrice = product?.businessPriceInPaise ?? 0;

  return (
    <li className={cn(LINE_COLUMNS.row, "border-b border-gray-100 px-4 py-3 last:border-0")}>
      <div className={LINE_COLUMNS.part}>
        <PartNumberInput
          id={`part-${line.id}`}
          label={`Part number, row ${position}`}
          value={line.query}
          onChange={onQueryChange}
          onSelect={onSelectProduct}
          isInvalid={check?.status === "not_found"}
        />
      </div>

      <div className={LINE_COLUMNS.product}>
        {product ? (
          <div className="flex flex-col gap-1">
            <span className="truncate text-sm font-medium text-gray-900">{product.name}</span>
            <span className="text-xs text-gray-500">
              {product.brand} · {getPackLabel(product)}
            </span>
          </div>
        ) : (
          !check && <span className="text-sm text-gray-500">Type a part number or name</span>
        )}
        {check && check.status !== "ready" && (
          <div className="mt-1">
            <LineStatusNote check={check} />
          </div>
        )}
      </div>

      {product && (
        <>
          <div className={LINE_COLUMNS.stock}>
            <StockStatus quantity={stock} />
          </div>
          <div className={LINE_COLUMNS.price}>
            <span className="text-sm font-medium text-gray-900 tabular-nums">
              {formatPrice(unitPrice)}
            </span>
            <span className="text-xs text-gray-500"> / {product.unit}</span>
          </div>
          <div className={LINE_COLUMNS.quantity}>
            <QuantityStepper
              id={`qty-${line.id}`}
              label={`Quantity, row ${position}`}
              value={line.quantity}
              onChange={onQuantityChange}
              onEnter={onNext}
            />
          </div>
          <div className={LINE_COLUMNS.total}>
            <span className="text-sm font-semibold text-gray-900 tabular-nums">
              {formatPrice(unitPrice * line.quantity)}
            </span>
          </div>
        </>
      )}

      <div className={cn(LINE_COLUMNS.remove, !product && "ml-auto")}>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          aria-label={`Remove row ${position}`}
          className="text-gray-500 hover:text-danger-700"
        >
          <Trash2 aria-hidden />
        </Button>
      </div>
    </li>
  );
}
