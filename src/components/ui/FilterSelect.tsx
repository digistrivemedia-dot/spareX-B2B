"use client";

import { useSearchParams } from "next/navigation";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

// Radix Select can't use "" as an item value, so "all" stands for "no filter".
const ALL = "all";

type FilterSelectProps = {
  /** The URL search param this select controls. */
  param: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
};

/** A labelled select that keeps its choice in the URL; changing it goes back to page 1. */
export function FilterSelect({ param, label, allLabel, options }: FilterSelectProps) {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const id = `filter-${param}`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={searchParams.get(param) ?? ALL}
        onValueChange={(value) =>
          updateSearchParams({ [param]: value === ALL ? null : value, page: null })
        }
      >
        <SelectTrigger id={id} className="w-full sm:w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{allLabel}</SelectItem>
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
