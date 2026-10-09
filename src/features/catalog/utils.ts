import {
  BatteryFull,
  CircleDot,
  Cog,
  Disc3,
  Droplet,
  Filter,
  HardHat,
  Lightbulb,
  Link2,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { Product } from "@/features/catalog/types";

/** At or below this many units a part shows as "Low" stock. */
const LOW_STOCK_THRESHOLD = 10;

/** Placeholder pictures for products without photos, by category id. */
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  oils: Droplet,
  brakes: Disc3,
  chain: Link2,
  filters: Filter,
  batteries: BatteryFull,
  tyres: CircleDot,
  lighting: Lightbulb,
  electricals: Zap,
  transmission: Cog,
  engine: Wrench,
  helmets: HardHat,
};

export function getCategoryIcon(categoryId: string): LucideIcon {
  return CATEGORY_ICONS[categoryId] ?? Wrench;
}

/** The unit price (excl. GST) this quantity earns: the best tier reached, else the business price. */
export function getUnitPrice(
  product: Pick<Product, "businessPriceInPaise" | "tierPrices">,
  quantity: number,
): number {
  return (product.tierPrices ?? [])
    .filter((tier) => quantity >= tier.minQty)
    .reduce((best, tier) => Math.min(best, tier.priceInPaise), product.businessPriceInPaise);
}

export function getStockAtBranch(product: Pick<Product, "stockByBranch">, branchId: string) {
  return product.stockByBranch.find((stock) => stock.branchId === branchId)?.quantity ?? 0;
}

export function getStockStatus(quantity: number) {
  if (quantity === 0) return "out_of_stock";
  return quantity <= LOW_STOCK_THRESHOLD ? "low_stock" : "in_stock";
}

/** "Carton of 12" for packed parts, "Per pair" for parts sold singly. */
export function getPackLabel({
  unit,
  packSize,
  packName,
}: Pick<Product, "unit" | "packSize" | "packName">) {
  if (packSize === 1 || !packName) return `Per ${unit}`;
  return `${packName[0].toUpperCase()}${packName.slice(1)} of ${packSize}`;
}

/** "KTM Duke 200, RC 200 +3", or "Universal" for parts that fit any bike. */
export function formatFits(bikes: Product["compatibleBikes"]): string {
  if (bikes.length === 0) return "Universal";
  const [first, second, ...rest] = bikes;
  const names = [`${first.brand} ${first.model}`];
  if (second)
    names.push(second.brand === first.brand ? second.model : `${second.brand} ${second.model}`);
  return rest.length ? `${names.join(", ")} +${rest.length}` : names.join(", ");
}
