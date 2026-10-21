import { ProductImage } from "@/components/ui/ProductImage";
import { ProductLink } from "@/features/catalog/components/ProductLink";
import type { Product } from "@/features/catalog/types";
import { formatFits, getCategoryIcon } from "@/features/catalog/utils";

/** Thumbnail, name (opens the drawer), part number, brand and fitment: a catalogue row's first cell. */
export function ProductSummary({ product }: { product: Product }) {
  return (
    <div className="flex items-center gap-3">
      <ProductImage
        src={product.images[0]}
        alt=""
        fallbackIcon={getCategoryIcon(product.category.id)}
        size="sm"
      />
      <div className="flex w-48 min-w-0 flex-col gap-0.5 whitespace-normal">
        <ProductLink productId={product.id}>{product.name}</ProductLink>
        <span className="text-xs text-gray-500">
          {product.partNumber} · {product.brand}
        </span>
        <span className="text-xs text-gray-500">Fits {formatFits(product.compatibleVehicles)}</span>
      </div>
    </div>
  );
}
