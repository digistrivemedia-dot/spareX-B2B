/** The shape of every paginated list the API returns. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type SortOrder = "asc" | "desc";
