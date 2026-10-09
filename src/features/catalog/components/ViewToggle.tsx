"use client";

import { LayoutGrid, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CatalogView } from "@/features/catalog/search-params";
import { useUpdateSearchParams } from "@/hooks/use-update-search-params";
import { cn } from "@/lib/utils";

const VIEWS = [
  { view: "table", label: "Table view", icon: List },
  { view: "grid", label: "Grid view", icon: LayoutGrid },
] as const;

export function ViewToggle({ view }: { view: CatalogView }) {
  const updateSearchParams = useUpdateSearchParams();

  return (
    <div
      role="group"
      aria-label="Layout"
      className="flex rounded-lg border border-input bg-white p-0.5"
    >
      {VIEWS.map(({ view: option, label, icon: Icon }) => (
        <Button
          key={option}
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          aria-pressed={view === option}
          onClick={() => updateSearchParams({ view: option === "grid" ? "grid" : null })}
          className={cn(view === option && "bg-navy-50 text-navy-800 hover:bg-navy-50")}
        >
          <Icon aria-hidden />
        </Button>
      ))}
    </div>
  );
}
