import { cva } from "class-variance-authority";

import { Price } from "@/components/ui/Price";
import type { Product } from "@/features/catalog/types";
import { getDiscountPercent } from "@/features/catalog/utils";
import { formatPrice } from "@/lib/format";

const stackVariants = cva("flex flex-col gap-0.5", {
  variants: {
    align: { start: "items-start", end: "items-end" },
  },
});

type ProductPriceProps = {
  product: Pick<Product, "businessPriceInPaise" | "b2cPriceInPaise" | "mrpInPaise">;
  align: "start" | "end";
};

/**
 * Your price (excl. GST), the B2C price it is discounted from, and the MRP. An Indian MRP always
 * includes every tax, so it needs no GST label.
 */
export function ProductPrice({ product, align }: ProductPriceProps) {
  return (
    <div className={stackVariants({ align })}>
      <Price amountInPaise={product.businessPriceInPaise} gst="excl" />
      <span className="text-xs whitespace-nowrap text-gray-500 tabular-nums">
        <s>{formatPrice(product.b2cPriceInPaise)}</s>{" "}
        <span className="font-medium text-success-700">{getDiscountPercent(product)}% off</span>
      </span>
      <span className="text-xs text-gray-500 tabular-nums">
        MRP {formatPrice(product.mrpInPaise)}
      </span>
    </div>
  );
}
