"use client";

import { useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name, A to Z" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

/** The same `sort` and `order` URL params the table headers set, for the grid view and phones. */
export function SortSelect() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const current = `${searchParams.get("sort") ?? "name"}-${searchParams.get("order") ?? "asc"}`;

  function handleChange(value: string) {
    const [sort, order] = value.split("-");
    updateSearchParams({ sort, order, page: null });
  }

  return (
    <Select value={current} onValueChange={handleChange}>
      <SelectTrigger aria-label="Sort parts" className="w-44">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
