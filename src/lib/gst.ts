/** Every demo item carries 18% GST. Products still store their own rate for when that changes. */
export const DEFAULT_GST_RATE_PERCENT = 18;

export const GSTIN_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/** GST state codes (the first two digits of a GSTIN). */
const STATES_BY_CODE: Record<string, string> = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};

export function isValidGstin(gstin: string): boolean {
  return GSTIN_PATTERN.test(gstin) && gstin.slice(0, 2) in STATES_BY_CODE;
}

/** PAN is characters 3–12 of the GSTIN. */
export function getPanFromGstin(gstin: string): string {
  return gstin.slice(2, 12);
}

/** "29AAKFS4821M1Z3" → "Karnataka" */
export function getStateFromGstin(gstin: string): string | undefined {
  return STATES_BY_CODE[gstin.slice(0, 2)];
}

/** GST on an amount excluding GST, rounded to the nearest paisa. */
export function calculateGst(
  amountInPaise: number,
  ratePercent = DEFAULT_GST_RATE_PERCENT,
): number {
  return Math.round((amountInPaise * ratePercent) / 100);
}
