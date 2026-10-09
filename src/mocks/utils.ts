import type { Paginated, SortOrder } from "@/lib/types";

/**
 * Demo dates are relative to today so "9 days overdue" or "valid 5 more days" stays true
 * whenever the demo runs. Returns an ISO string at the given hour, India time.
 */
export function daysFromToday(days: number, hour = 11, minute = 0): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  // India is UTC+05:30.
  date.setUTCHours(hour - 5, minute - 30, 0, 0);
  return date.toISOString();
}

/** Mock handlers wait like a real network call, so loading states are visible in the demo. */
export function simulateLatency(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Looks up a seed record by id and fails loudly if demo data references something missing. */
export function findById<T extends { id: string }>(items: readonly T[], id: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`Demo data: no record with id "${id}"`);
  return item;
}

export const DEFAULT_PAGE_SIZE = 10;

/** Sorts a copy of the list by one field, the way the API's `sort` and `order` params do. */
export function sortItems<T>(items: readonly T[], key: keyof T, order: SortOrder): T[] {
  const direction = order === "asc" ? 1 : -1;
  return [...items].sort((a, b) => {
    const [x, y] = [a[key], b[key]];
    if (x === y) return 0;
    return (x > y ? 1 : -1) * direction;
  });
}

/** Cuts one page out of a list, returning the shape every list endpoint returns. */
export function paginate<T>(
  items: readonly T[],
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): Paginated<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length };
}
