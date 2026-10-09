"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "@/features/company/components/BranchesProvider";
import { ORDER_FILTER_KEYS } from "@/features/orders/search-params";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

// Radix Select can't use "" as an item value, so "all" stands for "no filter".
const ALL = "all";
const STATUS_OPTIONS = [
  { value: ALL, label: "All statuses" },
  { value: "open", label: "Open (not yet delivered)" },
  { value: "placed", label: "Placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];
const DEBOUNCE_MS = 300;
const CLEARED = Object.fromEntries(ORDER_FILTER_KEYS.map((key) => [key, null]));

/** Search by order or PO number, and filter by status, branch and date placed. */
export function OrdersToolbar() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const branches = useBranches();
  const searchRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const q = searchParams.get("q") ?? "";

  useEffect(() => () => clearTimeout(timerRef.current), []);
  // Keep the search box in step when the filters are cleared.
  useEffect(() => {
    if (searchRef.current && document.activeElement !== searchRef.current) {
      searchRef.current.value = q;
    }
  }, [q]);

  // Any filter change goes back to page 1.
  const setFilter = (key: string, value: string | null) =>
    updateSearchParams({ [key]: value && value !== ALL ? value : null, page: null });

  return (
    <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Label htmlFor="orders-search">Order or PO number</Label>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
          />
          <Input
            ref={searchRef}
            id="orders-search"
            type="search"
            defaultValue={q}
            placeholder="e.g. 0417 or PO/SSW/2026/041"
            className="pl-9"
            onChange={(event) => {
              const value = event.target.value.trim();
              clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => setFilter("q", value), DEBOUNCE_MS);
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <FilterSelect
          id="orders-status"
          label="Status"
          value={searchParams.get("status") ?? ALL}
          options={STATUS_OPTIONS}
          onChange={(value) => setFilter("status", value)}
        />
        <FilterSelect
          id="orders-branch"
          label="Branch"
          value={searchParams.get("branch") ?? ALL}
          options={[
            { value: ALL, label: "All branches" },
            ...branches.map((branch) => ({ value: branch.id, label: branch.name })),
          ]}
          onChange={(value) => setFilter("branch", value)}
        />
        <DateFilter
          id="orders-from"
          label="Placed from"
          value={searchParams.get("from")}
          onChange={(value) => setFilter("from", value)}
        />
        <DateFilter
          id="orders-to"
          label="Placed to"
          value={searchParams.get("to")}
          onChange={(value) => setFilter("to", value)}
        />
      </div>
      {ORDER_FILTER_KEYS.some((key) => searchParams.has(key)) && (
        <Button variant="ghost" onClick={() => updateSearchParams({ ...CLEARED, page: null })}>
          Clear filters
        </Button>
      )}
    </div>
  );
}

type FilterSelectProps = {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
};

function FilterSelect({ id, label, value, options, onChange }: FilterSelectProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full xl:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type DateFilterProps = {
  id: string;
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

function DateFilter({ id, label, value, onChange }: DateFilterProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="xl:w-40"
      />
    </div>
  );
}
