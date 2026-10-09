import type { Product } from "@/features/catalog/types";
import { getPackLabel } from "@/features/catalog/utils";
import { AddToCart } from "@/features/cart/components/AddToCart";

/** The add-to-cart control with the pack size and MOQ that govern it, right underneath. */
export function PackAddToCart({ product }: { product: Product }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <AddToCart product={product} />
      <span className="text-xs text-gray-500">
        {getPackLabel(product)} · MOQ {product.moq}
      </span>
    </div>
  );
}
