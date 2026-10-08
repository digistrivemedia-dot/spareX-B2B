"use client";

import { functionalUpdate, type OnChangeFn, type SortingState } from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";

import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

/** Table sorting backed by `?sort=<column>&order=asc|desc`. Changing it goes back to page 1. */
export function useUrlSorting(): [SortingState, OnChangeFn<SortingState>] {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();

  const sortBy = searchParams.get("sort");
  const sorting: SortingState = sortBy
    ? [{ id: sortBy, desc: searchParams.get("order") === "desc" }]
    : [];

  const setSorting: OnChangeFn<SortingState> = (updater) => {
    const [next] = functionalUpdate(updater, sorting);
    updateSearchParams({
      sort: next?.id ?? null,
      order: next ? (next.desc ? "desc" : "asc") : null,
      page: null,
    });
  };

  return [sorting, setSorting];
}
