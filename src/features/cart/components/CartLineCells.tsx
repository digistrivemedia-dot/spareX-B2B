"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { getUnitPrice } from "@/features/catalog/utils";
import { useCartStore } from "@/features/cart/store";
import type { CartLine } from "@/features/cart/types";
import { formatPrice } from "@/lib/format";

/** The unit price the quantity earns; a struck-through standard price when a bulk tier applies. */
export function CartUnitPrice({ line }: { line: CartLine }) {
  const unitPrice = getUnitPrice(line.product, line.quantity);
  const hasTier = unitPrice < line.product.businessPriceInPaise;

  return (
    <div className="flex flex-col items-end">
      <span className="font-semibold text-gray-900">{formatPrice(unitPrice)}</span>
      {hasTier && (
        <span className="text-xs text-success-700">
          Bulk price ·{" "}
          <s className="text-gray-500">{formatPrice(line.product.businessPriceInPaise)}</s>
        </span>
      )}
    </div>
  );
}

export function CartQuantity({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  return (
    <QuantityStepper
      label={`Quantity of ${line.product.name}`}
      min={line.product.moq}
      step={line.product.packSize}
      value={line.quantity}
      onChange={(quantity) => setQuantity(line.id, quantity)}
    />
  );
}

export function CartLineTotal({ line }: { line: CartLine }) {
  return (
    <span className="font-semibold text-gray-900">
      {formatPrice(getUnitPrice(line.product, line.quantity) * line.quantity)}
    </span>
  );
}

/** Removes the line, with an undo in the toast in case it was a slip. */
export function RemoveFromCartButton({ line }: { line: CartLine }) {
  const removeItem = useCartStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);

  function handleRemove() {
    removeItem(line.id);
    toast(`${line.product.name} removed`, {
      action: { label: "Undo", onClick: () => addItem(line.id, line.quantity) },
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleRemove}
      aria-label={`Remove ${line.product.name}`}
      className="text-gray-500 hover:text-danger-700"
    >
      <Trash2 aria-hidden />
    </Button>
  );
}
