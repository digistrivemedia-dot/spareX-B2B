/** Indian plates: state code, district number, series letters, then 4 digits, e.g. KA 01 AB 1234. */
const PLATE = /^([A-Z]{2})(\d{1,2})([A-Z]{0,3})(\d{4})$/;

/** Bharat series plates, e.g. 22 BH 1234 AA. */
const BH_PLATE = /^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/;

const compact = (plate: string) => plate.toUpperCase().replace(/[^A-Z0-9]/g, "");

export function isValidPlate(plate: string): boolean {
  return PLATE.test(compact(plate)) || BH_PLATE.test(compact(plate));
}

/** "ka01ab1234" → "KA 01 AB 1234", the way it is written on the plate. */
export function formatPlate(plate: string): string {
  const value = compact(plate);
  const match = value.match(PLATE) ?? value.match(BH_PLATE);
  if (!match) return value;
  const [, ...parts] = match;
  // Single-digit district numbers are written with a leading zero, e.g. KA 1 → KA 01.
  if (PLATE.test(value)) parts[1] = parts[1].padStart(2, "0");
  return parts.filter(Boolean).join(" ");
}
