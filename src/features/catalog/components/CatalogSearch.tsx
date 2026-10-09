"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";

const DEBOUNCE_MS = 300;

/** Filters the catalogue as you type (after a short pause), by name, part number or brand. */
export function CatalogSearch() {
  const searchParams = useSearchParams();
  const updateSearchParams = useUpdateSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const q = searchParams.get("q") ?? "";

  // Keep the box in step when the search changes from outside, e.g. the top-bar search.
  useEffect(() => {
    const input = inputRef.current;
    if (input && document.activeElement !== input) input.value = q;
  }, [q]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleChange(value: string) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => updateSearchParams({ q: value.trim() || null, page: null }),
      DEBOUNCE_MS,
    );
  }

  return (
    <div className="relative min-w-0 flex-1">
      <label htmlFor="catalog-search" className="sr-only">
        Search parts by name, part number or brand
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
      />
      <Input
        ref={inputRef}
        id="catalog-search"
        type="search"
        defaultValue={q}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Name, part number or brand"
        autoComplete="off"
        className="pl-9"
      />
    </div>
  );
}
