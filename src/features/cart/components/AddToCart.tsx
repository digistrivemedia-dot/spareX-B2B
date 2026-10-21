"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { Product } from "@/features/catalog/types";
import { useBranchStock } from "@/features/catalog/use-branch-stock";
import { useCartStore } from "@/features/cart/store";
import { formatCount } from "@/lib/format";

type AddToCartProps = {
  product: Pick<Product, "id" | "name" | "unit" | "stockByBranch">;
};

/** A quantity stepper with an "Add" button; disabled when out of stock. */
export function AddToCart({ product }: AddToCartProps) {
  const isOutOfStock = useBranchStock(product) === 0;
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

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
