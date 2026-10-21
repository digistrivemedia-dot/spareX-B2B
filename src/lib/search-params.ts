/** Page search params as Next.js passes them. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** The first value of a search param, or undefined when it is missing or empty. */
export function getParam(raw: RawSearchParams, key: string): string | undefined {
  const value = raw[key];
  return (Array.isArray(value) ? value[0] : value) || undefined;
}

/** The value only if it is one of the allowed options. */
export function pickParam<T extends string>(
  raw: RawSearchParams,
  key: string,
  allowed: readonly T[],
): T | undefined {
  const value = getParam(raw, key);
  return allowed.find((option) => option === value);
}

/** A positive page number, 1 by default. */
export function parsePage(raw: RawSearchParams): number {
  const page = Number(getParam(raw, "page"));
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/** `from` and `to` as "YYYY-MM-DD", dropping anything that isn't a date. */
export function parseDateRange(raw: RawSearchParams): { from?: string; to?: string } {
  const date = (key: string) => {
    const value = getParam(raw, key);
    return value && DATE.test(value) ? value : undefined;
  };
  return { from: date("from"), to: date("to") };
}
