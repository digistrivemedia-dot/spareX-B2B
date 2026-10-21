import type { ListParams } from "@/lib/types";

export type Category = {
  id: string;
  name: string;
};

export type VehicleType = "two_wheeler" | "three_wheeler" | "car" | "commercial";

export type VehicleModel = {
  id: string;
  type: VehicleType;
  brand: string;
  model: string;
};

/** Units available for delivery to one of the customer's branches. */
export type BranchStock = {
  branchId: string;
  quantity: number;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  partNumber: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  hsnCode: string;
  gstRatePercent: number;
  /** MRP per unit, including GST. */
  mrpInPaise: number;
  /** The consumer site's price per unit, excluding GST. */
  b2cPriceInPaise: number;
  /** This business's price per unit, excluding GST: the B2C price less its business discount. */
  businessPriceInPaise: number;
  /** What one unit is, e.g. "bottle", "pair", "kit". */
  unit: string;
  /** Units in the pack the part ships in, for information; any quantity can be ordered. */
  packSize: number;
  /** What a pack is called when packSize > 1, e.g. "carton", "box". */
  packName?: string;
  stockByBranch: BranchStock[];
  /** Empty means the part is universal. */
  compatibleVehicles: VehicleModel[];
  images: string[];
  specs: ProductSpec[];
};

export type CatalogSort = "name" | "price";

export type CatalogFilters = ListParams<CatalogSort> & {
  /** Matches name, part number or brand. */
  q?: string;
  categoryId?: string;
  brands?: string[];
  /** Fits this vehicle type, make (e.g. "KTM") or, most precisely, this model id. */
  vehicleType?: VehicleType;
  vehicleBrand?: string;
  vehicleId?: string;
  /** Only parts with stock at this delivery branch. */
  inStockAtBranchId?: string;
};

/** Everything the catalogue filters can offer. */
export type CatalogFilterOptions = {
  categories: Category[];
  brands: string[];
  vehicleModels: VehicleModel[];
};
