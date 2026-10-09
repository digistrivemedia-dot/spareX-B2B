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
