"use client";

import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

type DateRangeFilterProps = {
  /** Prefix for the input ids, so two filters can share a page. */
  id: string;
  fromLabel?: string;
  toLabel?: string;
};

/** "From" and "To" dates kept in the URL as `from` and `to` (YYYY-MM-DD); changing one goes to page 1. */
export function DateRangeFilter({ id, fromLabel = "From", toLabel = "To" }: DateRangeFilterProps) {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const set = (key: "from" | "to", value: string) =>
    updateSearchParams({ [key]: value || null, page: null });

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-from`}>{fromLabel}</Label>
        <Input
          id={`${id}-from`}
          type="date"
          value={from}
          max={to || undefined}
          onChange={(event) => set("from", event.target.value)}
          className="w-40"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-to`}>{toLabel}</Label>
        <Input
          id={`${id}-to`}
          type="date"
          value={to}
          min={from || undefined}
          onChange={(event) => set("to", event.target.value)}
          className="w-40"
        />
      </div>
      {(from || to) && (
        <Button
          variant="ghost"
          onClick={() => updateSearchParams({ from: null, to: null, page: null })}
        >
          Clear dates
        </Button>
      )}
    </div>
  );
}
