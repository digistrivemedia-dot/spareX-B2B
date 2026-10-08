export type Category = {
  id: string;
  name: string;
};

export type BikeModel = {
  id: string;
  brand: string;
  model: string;
};

/** A lower unit price once the quantity reaches `minQty`. Excludes GST. */
export type TierPrice = {
  minQty: number;
  priceInPaise: number;
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
  /** This customer's price per unit, excluding GST. */
  businessPriceInPaise: number;
  tierPrices?: TierPrice[];
  /** What one unit is, e.g. "bottle", "pair", "kit". */
  unit: string;
  /** Units per pack. Order quantities must be a multiple of this. */
  packSize: number;
  /** What a pack is called when packSize > 1, e.g. "carton", "box". */
  packName?: string;
  /** Minimum order quantity, in units. */
  moq: number;
  stockByBranch: BranchStock[];
  /** Empty means the part is universal. */
  compatibleBikes: BikeModel[];
  images: string[];
  specs: ProductSpec[];
};
