"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

const DEBOUNCE_MS = 300;

type SearchFilterProps = {
  id: string;
  label: string;
  placeholder: string;
};

/** A search box that keeps its text in the URL as `q`, updating as you type (debounced). */
export function SearchFilter({ id, label, placeholder }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
        />
        <Input
          id={id}
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder={placeholder}
          className="pl-9"
          onChange={(event) => {
            const value = event.target.value.trim();
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(
              () => updateSearchParams({ q: value || null, page: null }),
              DEBOUNCE_MS,
            );
          }}
        />
      </div>
    </div>
  );
}
