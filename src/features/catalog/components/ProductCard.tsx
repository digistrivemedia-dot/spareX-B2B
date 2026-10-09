import { ProductImage } from "@/components/ui/ProductImage";
import { BranchStockStatus } from "@/features/catalog/components/BranchStockStatus";
import { PackAddToCart } from "@/features/catalog/components/PackAddToCart";
import { ProductLink } from "@/features/catalog/components/ProductLink";
import { ProductPrice } from "@/features/catalog/components/ProductPrice";
import type { Product } from "@/features/catalog/types";
import { formatFits, getCategoryIcon } from "@/features/catalog/utils";

/** A product in the grid view. */
export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex w-full flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <ProductImage
        src={product.images[0]}
        alt=""
        fallbackIcon={getCategoryIcon(product.category.id)}
        size="lg"
      />
      <div className="flex flex-1 flex-col gap-1">
        <span className="text-xs text-gray-500">
          {product.brand} · {product.partNumber}
        </span>
        <h3 className="text-sm leading-snug">
          <ProductLink productId={product.id}>{product.name}</ProductLink>
        </h3>
        <span className="text-xs text-gray-500">Fits {formatFits(product.compatibleBikes)}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <ProductPrice product={product} align="start" />
        <BranchStockStatus product={product} />
      </div>
      <PackAddToCart product={product} />
    </article>
  );
}
