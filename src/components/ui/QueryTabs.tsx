"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

type QueryTabsProps = {
  label: string;
  /** The search param the tabs set, e.g. "status". */
  param: string;
  /** A null value is the "All" tab, which removes the param. */
  tabs: { value: string | null; label: string; count?: number }[];
};

/** Tabs that filter a list through one search param; switching tabs goes back to page 1. */
export function QueryTabs({ label, param, tabs }: QueryTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(param);

  const hrefFor = (value: string | null) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (value) params.set(param, value);
    else params.delete(param);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <nav aria-label={label} className="mb-4 overflow-x-auto">
      <ul className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = tab.value === current;
          return (
            <li key={tab.value ?? "all"}>
              <Link
                href={hrefFor(tab.value)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "-mb-px flex h-10 items-center gap-2 border-b-2 px-3 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  isActive
                    ? "border-orange-700 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900",
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="rounded-full bg-gray-100 px-1.5 text-xs text-gray-700 tabular-nums">
                    {tab.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
