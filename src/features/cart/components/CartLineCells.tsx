"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCartStore } from "@/features/cart/store";
import type { CartLine } from "@/features/cart/types";
import { formatPrice } from "@/lib/format";

/** Your price, with the B2C price it is discounted from struck through. */
export function CartUnitPrice({ line }: { line: CartLine }) {
  return (
    <div className="flex flex-col items-end">
      <span className="font-semibold text-gray-900">
        {formatPrice(line.product.businessPriceInPaise)}
      </span>
      <s className="text-xs text-gray-500">{formatPrice(line.product.b2cPriceInPaise)}</s>
    </div>
  );
}

export function CartQuantity({ line }: { line: CartLine }) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  return (
    <QuantityStepper
      label={`Quantity of ${line.product.name}`}
      value={line.quantity}
      onChange={(quantity) => setQuantity(line.id, quantity)}
    />
  );
}

export function CartLineTotal({ line }: { line: CartLine }) {
  return (
    <span className="font-semibold text-gray-900">
      {formatPrice(line.product.businessPriceInPaise * line.quantity)}
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
