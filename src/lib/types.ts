/** The shape of every paginated list the API returns. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type SortOrder = "asc" | "desc";

/** Paging and sorting parameters every list endpoint accepts. */
export type ListParams<TSort extends string = string> = {
  page?: number;
  pageSize?: number;
  sort?: TSort;
  order?: SortOrder;
};

/**
 * What a Server Action returns. Actions report failures as a message rather than throwing,
 * because Next.js hides thrown error messages from the browser in production.
 */
export type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };
