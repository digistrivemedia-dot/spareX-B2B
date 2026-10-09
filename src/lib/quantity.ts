/** Order-quantity rules for a product: at least `min`, always a whole number of packs. */
export type QuantityRules = {
  min: number;
  step: number;
};

/** Rounds a quantity up to the nearest allowed value, e.g. 7 with MOQ 12 in cartons of 12 → 12. */
export function snapQuantity(quantity: number, { min, step }: QuantityRules): number {
  const atLeastMin = Math.max(quantity, min);
  return Math.ceil(atLeastMin / step) * step;
}
