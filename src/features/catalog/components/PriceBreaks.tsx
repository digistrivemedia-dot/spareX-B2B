import type { Product } from "@/features/catalog/types";
import { formatNumber, formatPrice } from "@/lib/format";

type PriceBreak = { label: string; priceInPaise: number };

/** "12–23 → ₹302, 24–59 → ₹293, 60+ → ₹284": every quantity band and its unit price. */
function getPriceBreaks({ moq, businessPriceInPaise, tierPrices = [] }: Product): PriceBreak[] {
  const bands = [{ minQty: moq, priceInPaise: businessPriceInPaise }, ...tierPrices];
  return bands.map((band, index) => {
    const next = bands[index + 1];
    const label = next
      ? `${formatNumber(band.minQty)}–${formatNumber(next.minQty - 1)}`
      : `${formatNumber(band.minQty)}+`;
    return { label, priceInPaise: band.priceInPaise };
  });
}

export function PriceBreaks({ product }: { product: Product }) {
  const breaks = getPriceBreaks(product);

  return (
    <dl className="divide-y divide-gray-100 rounded-lg border border-gray-200 text-sm">
      <div className="flex justify-between bg-gray-50 px-3 py-2 text-xs font-medium text-gray-500">
        <dt>Quantity ({product.unit}s)</dt>
        <dd>Price per {product.unit}, excl. GST</dd>
      </div>
      {breaks.map(({ label, priceInPaise }) => (
        <div key={label} className="flex justify-between px-3 py-2">
          <dt className="text-gray-700 tabular-nums">{label}</dt>
          <dd className="font-semibold text-gray-900 tabular-nums">{formatPrice(priceInPaise)}</dd>
        </div>
      ))}
    </dl>
  );
}
