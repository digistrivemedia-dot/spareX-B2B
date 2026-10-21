"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { Input } from "@/components/ui/input";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { getCatalog } from "@/features/catalog/api";
import type { Product } from "@/features/catalog/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 200;
const MAX_SUGGESTIONS = 6;

type PartNumberInputProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (product: Product) => void;
  label: string;
  isInvalid?: boolean;
};

/** A part-number box that suggests parts by number or name. Arrow keys move, Enter picks. */
export function PartNumberInput({
  id,
  value,
  onChange,
  onSelect,
  label,
  isInvalid,
}: PartNumberInputProps) {
  const [suggestions, setSuggestions] = useState<Product[] | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  // Only the newest search may show its results; slower, older ones are ignored.
  const latestSearchRef = useRef(0);
  const listId = `${id}-suggestions`;
  const isOpen = suggestions !== null;

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function search(text: string) {
    clearTimeout(timerRef.current);
    if (text.trim().length < MIN_QUERY_LENGTH) return setSuggestions(null);
    timerRef.current = setTimeout(async () => {
      const searchId = ++latestSearchRef.current;
      const { items } = await getCatalog({ q: text, pageSize: MAX_SUGGESTIONS });
      if (searchId !== latestSearchRef.current) return;
      setSuggestions(items);
      setActiveIndex(0);
    }, DEBOUNCE_MS);
  }

  function choose(product: Product) {
    setSuggestions(null);
    onSelect(product);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!suggestions?.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + suggestions.length) % suggestions.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      choose(suggestions[activeIndex]);
    } else if (event.key === "Escape") {
      setSuggestions(null);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && setSuggestions(null)}>
      <PopoverAnchor asChild>
        <Input
          id={id}
          role="combobox"
          aria-label={label}
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={suggestions?.length ? `${listId}-${activeIndex}` : undefined}
          aria-invalid={isInvalid}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            search(event.target.value);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => setSuggestions(null)}
          placeholder="Part no. or name"
          autoComplete="off"
          spellCheck={false}
        />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="w-96 max-w-[calc(100vw-2rem)] p-1"
        // Typing continues in the input; the list must never take focus.
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        {suggestions?.length === 0 ? (
          <p className="px-2 py-3 text-sm text-gray-500">No part matches &ldquo;{value}&rdquo;.</p>
        ) : (
          <ul id={listId} role="listbox" aria-label="Matching parts">
            {suggestions?.map((product, index) => (
              <li
                key={product.id}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                // Keeps focus in the input; a normal mousedown would blur it and close the list.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(product)}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-md px-2 py-1.5",
                  index === activeIndex && "bg-gray-100",
                )}
              >
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium text-gray-900">{product.name}</span>
                  <span className="text-xs text-gray-500">
                    {product.partNumber} · {product.brand}
                  </span>
                </span>
                <span className="text-sm font-semibold whitespace-nowrap text-gray-900 tabular-nums">
                  {formatPrice(product.businessPriceInPaise)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
