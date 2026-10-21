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

import type { Product, VehicleType } from "@/features/catalog/types";

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

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  two_wheeler: "Two-wheeler",
  three_wheeler: "Three-wheeler",
  car: "Car",
  commercial: "Commercial vehicle",
};

/** How far the business price is below the B2C price, e.g. 15. */
export function getDiscountPercent({
  b2cPriceInPaise,
  businessPriceInPaise,
}: Pick<Product, "b2cPriceInPaise" | "businessPriceInPaise">): number {
  return Math.round((1 - businessPriceInPaise / b2cPriceInPaise) * 100);
}

export function getStockAtBranch(product: Pick<Product, "stockByBranch">, branchId: string) {
  return product.stockByBranch.find((stock) => stock.branchId === branchId)?.quantity ?? 0;
}

export function getStockStatus(quantity: number) {
  if (quantity === 0) return "out_of_stock";
  return quantity <= LOW_STOCK_THRESHOLD ? "low_stock" : "in_stock";
}

/** "Carton of 12" for parts that ship packed, "Per pair" for parts that ship singly. */
export function getPackLabel({
  unit,
  packSize,
  packName,
}: Pick<Product, "unit" | "packSize" | "packName">) {
  if (packSize === 1 || !packName) return `Per ${unit}`;
  return `${packName[0].toUpperCase()}${packName.slice(1)} of ${packSize}`;
}

/** "KTM Duke 200, RC 200 +3", or "Universal" for parts that fit any vehicle. */
export function formatFits(vehicles: Product["compatibleVehicles"]): string {
  if (vehicles.length === 0) return "Universal";
  const [first, second, ...rest] = vehicles;
  const names = [`${first.brand} ${first.model}`];
  if (second)
    names.push(second.brand === first.brand ? second.model : `${second.brand} ${second.model}`);
  return rest.length ? `${names.join(", ")} +${rest.length}` : names.join(", ");
}
