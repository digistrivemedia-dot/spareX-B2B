// Inputs using these have no maxLength: it would cut pasted text like "+91 98860 44120" before
// the spaces and prefix are stripped. These normalisers cap the length instead.

/** "+91 98860 44120", "098860 44120" or "9886044120" → "9886044120" */
export const toMobileDigits = (value: string) =>
  value
    .replace(/\D/g, "")
    .replace(/^(91|0)(?=\d{10}$)/, "")
    .slice(0, 10);

export const toPinDigits = (value: string) => value.replace(/\D/g, "").slice(0, 6);
