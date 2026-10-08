"use client";

import { Search } from "lucide-react";
import Form from "next/form";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Searches the catalogue by part number or name. Press "/" anywhere to jump here. */
type GlobalSearchProps = {
  className?: string;
};

export function GlobalSearch({ className }: GlobalSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function focusOnSlash(event: KeyboardEvent) {
      const target = event.target as HTMLElement;
      const isTyping =
        target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if (event.key !== "/" || isTyping) return;
      event.preventDefault();
      inputRef.current?.focus();
    }
    document.addEventListener("keydown", focusOnSlash);
    return () => document.removeEventListener("keydown", focusOnSlash);
  }, []);

  return (
    <Form
      action="/catalog"
      role="search"
      className={cn("relative w-full max-w-xl min-w-0", className)}
    >
      <label htmlFor="global-search" className="sr-only">
        Search by part number or name
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
      />
      <Input
        ref={inputRef}
        id="global-search"
        name="q"
        type="search"
        placeholder="Search by part number or name"
        autoComplete="off"
        className="pr-9 pl-9"
      />
      <kbd
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-2.5 hidden -translate-y-1/2 rounded border border-gray-200 bg-gray-50 px-1.5 text-xs text-gray-500 md:block"
      >
        /
      </kbd>
    </Form>
  );
}
