/** The cart keeps only what was chosen; prices and stock are always read fresh from the catalogue. */
export type CartItem = {
  productId: string;
  quantity: number;
};
