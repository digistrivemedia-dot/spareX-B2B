import type { Product } from "@/features/catalog/types";

/** The cart keeps only what was chosen; prices and stock are always read fresh from the catalogue. */
export type CartItem = {
  productId: string;
  quantity: number;
};

/** A cart item joined with its product, as the cart and checkout show it. `id` is the product id. */
export type CartLine = {
  id: string;
  product: Product;
  quantity: number;
};

/** Something the buyer should fix (or know) about a cart line. */
export type CartIssue = {
  message: string;
  /** Blocking issues stop checkout until fixed. */
  isBlocking: boolean;
  /** A one-click fix, e.g. raising the quantity to the MOQ. */
  fix?: { label: string; quantity: number };
};
