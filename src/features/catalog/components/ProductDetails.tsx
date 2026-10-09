import type { ReactNode } from "react";

import { ProductImage } from "@/components/ui/ProductImage";
import { BikeFitment } from "@/features/catalog/components/BikeFitment";
import { BranchAvailability } from "@/features/catalog/components/BranchAvailability";
import { PackAddToCart } from "@/features/catalog/components/PackAddToCart";
import { PriceBreaks } from "@/features/catalog/components/PriceBreaks";
import { ProductPrice } from "@/features/catalog/components/ProductPrice";
import type { Product } from "@/features/catalog/types";
import { getCategoryIcon } from "@/features/catalog/utils";

/** The scrolling body of the product drawer. */
export function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
      <ProductImage
        src={product.images[0]}
        alt={product.name}
        fallbackIcon={getCategoryIcon(product.category.id)}
        size="lg"
      />
      <p className="text-sm text-gray-700">{product.description}</p>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg bg-gray-50 p-4">
        <ProductPrice product={product} align="start" />
        <PackAddToCart product={product} />
      </div>

      <DetailSection title="Price breaks">
        <PriceBreaks product={product} />
      </DetailSection>
      <DetailSection title="Stock by branch">
        <BranchAvailability product={product} />
      </DetailSection>
      <DetailSection title="Fits">
        <BikeFitment bikes={product.compatibleBikes} />
      </DetailSection>
      <DetailSection title="Specifications">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          {product.specs.map((spec) => (
            <div key={spec.label} className="contents">
              <dt className="text-gray-500">{spec.label}</dt>
              <dd className="text-gray-900">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </DetailSection>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {children}
    </section>
  );
}
