"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { Product } from "@/features/catalog/types";
import { useCartStore } from "@/features/cart/store";
import { formatCount } from "@/lib/format";
import { snapQuantity } from "@/lib/quantity";

type AddToCartProps = {
  product: Pick<Product, "id" | "name" | "unit" | "moq" | "packSize">;
  isOutOfStock: boolean;
};

/** A quantity stepper (MOQ and pack size enforced) with an "Add" button. */
export function AddToCart({ product, isOutOfStock }: AddToCartProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const rules = { min: product.moq, step: product.packSize };
  const [quantity, setQuantity] = useState(() => snapQuantity(product.moq, rules));

  function handleAdd() {
    addItem(product.id, quantity);
    toast.success(`${formatCount(quantity, product.unit)} added to cart`, {
      description: product.name,
      action: { label: "View cart", onClick: () => router.push("/cart") },
    });
  }

  return (
    <div className="flex items-center gap-2">
      <QuantityStepper
        {...rules}
        value={quantity}
        onChange={setQuantity}
        label={`Quantity of ${product.name}`}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={handleAdd}
        disabled={isOutOfStock}
        aria-label={`Add ${product.name} to cart`}
      >
        <ShoppingCart aria-hidden />
        {isOutOfStock ? "Out of stock" : "Add"}
      </Button>
    </div>
  );
}
