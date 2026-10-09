"use client";

import { ProductDetails } from "@/features/catalog/components/ProductDetails";
import type { Product } from "@/features/catalog/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ProductDrawerProps = {
  /** The product to show; the drawer is closed when this is null. */
  product: Product | null;
  onClose: () => void;
};

export function ProductDrawer({ product, onClose }: ProductDrawerProps) {
  return (
    <Sheet open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="gap-0 data-[side=right]:w-full data-[side=right]:sm:max-w-xl">
        {product && (
          <>
            <SheetHeader className="border-b border-gray-200 px-6 pt-5 pr-14 pb-4">
              <p className="text-xs text-gray-500">
                {product.brand} · {product.category.name}
              </p>
              <SheetTitle className="text-lg leading-snug font-semibold text-gray-900">
                {product.name}
              </SheetTitle>
              <SheetDescription className="text-xs tabular-nums">
                Part no. {product.partNumber} · HSN {product.hsnCode} · GST {product.gstRatePercent}
                %
              </SheetDescription>
            </SheetHeader>
            <ProductDetails product={product} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
