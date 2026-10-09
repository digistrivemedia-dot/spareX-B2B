import { cva } from "class-variance-authority";

import { Price } from "@/components/ui/Price";
import { TierHint } from "@/features/catalog/components/TierHint";
import type { Product } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";

const stackVariants = cva("flex flex-col gap-0.5", {
  variants: {
    align: { start: "items-start", end: "items-end" },
  },
});

type ProductPriceProps = {
  product: Pick<Product, "businessPriceInPaise" | "mrpInPaise" | "tierPrices">;
  align: "start" | "end";
};

/**
 * Your price (excl. GST), the MRP and the first bulk-price break. An Indian MRP always
 * includes every tax, so it needs no GST label.
 */
export function ProductPrice({ product, align }: ProductPriceProps) {
  return (
    <div className={stackVariants({ align })}>
      <Price amountInPaise={product.businessPriceInPaise} gst="excl" />
      <span className="text-xs text-gray-500 tabular-nums">
        MRP {formatPrice(product.mrpInPaise)}
      </span>
      <TierHint tierPrices={product.tierPrices} />
    </div>
  );
}
