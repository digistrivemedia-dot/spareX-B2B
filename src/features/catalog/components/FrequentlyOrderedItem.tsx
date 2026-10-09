import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/components/ui/ProductImage";
import { StockStatus } from "@/features/catalog/components/StockStatus";
import { TierHint } from "@/features/catalog/components/TierHint";
import type { Product } from "@/features/catalog/types";
import { getCategoryIcon, getPackLabel } from "@/features/catalog/utils";
import { AddToCart } from "@/features/cart/components/AddToCart";

type FrequentlyOrderedItemProps = {
  product: Product;
  /** Units available at the selected delivery branch. */
  stock: number;
};

export function FrequentlyOrderedItem({ product, stock }: FrequentlyOrderedItemProps) {
  return (
    <li className="flex flex-col gap-3 px-4 py-3 @4xl:flex-row @4xl:items-center @4xl:gap-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          fallbackIcon={getCategoryIcon(product.category.id)}
          size="sm"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
          <p className="truncate text-xs text-gray-500">
            {product.partNumber} · {getPackLabel(product)} · MOQ {product.moq}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 @4xl:justify-end">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-start @4xl:items-end">
            <Price amountInPaise={product.businessPriceInPaise} gst="excl" />
            <TierHint tierPrices={product.tierPrices} />
          </div>
          <StockStatus quantity={stock} />
        </div>
        <AddToCart product={product} isOutOfStock={stock === 0} />
      </div>
    </li>
  );
}
