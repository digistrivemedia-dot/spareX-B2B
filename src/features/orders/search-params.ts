import type { OrderFilters, OrderSort, OrderStatus } from "@/features/orders/types";
import { OPEN_ORDER_STATUSES } from "@/features/orders/utils";

/**
 * The orders list keeps its state in the URL:
 *   q        order or PO number      status  "open" or one order status
 *   branch   branch id               from/to "YYYY-MM-DD" (placed between, inclusive)
 *   sort     "placedAt" | "totalInPaise"     order "asc" | "desc"     page
 */
export const ORDER_FILTER_KEYS = ["q", "status", "branch", "from", "to"] as const;

const STATUSES: OrderStatus[] = [...OPEN_ORDER_STATUSES, "delivered", "cancelled"];
const SORTS: OrderSort[] = ["placedAt", "totalInPaise"];
const DATE = /^\d{4}-\d{2}-\d{2}$/;

type RawSearchParams = Record<string, string | string[] | undefined>;

export function parseOrderParams(raw: RawSearchParams): OrderFilters {
  const get = (key: string) => {
    const value = raw[key];
    return (Array.isArray(value) ? value[0] : value) || undefined;
  };
  const date = (key: string) => {
    const value = get(key);
    return value && DATE.test(value) ? value : undefined;
  };
  const status = get("status");
  const single = STATUSES.find((option) => option === status);
  const page = Number(get("page"));

  return {
    q: get("q"),
    statuses: status === "open" ? OPEN_ORDER_STATUSES : single ? [single] : undefined,
    branchId: get("branch"),
    from: date("from"),
    to: date("to"),
    sort: SORTS.find((option) => option === get("sort")),
    order: get("order") === "asc" ? "asc" : "desc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  };
}
