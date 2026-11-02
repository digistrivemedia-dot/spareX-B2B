"use client";

import { cva } from "class-variance-authority";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

const listVariants = cva("", {
  variants: {
    variant: {
      underline: "flex gap-1 border-b border-gray-200",
      // Chips wrap onto a second row on wider screens and slide sideways on phones.
      chips: "flex gap-2 pb-1 sm:flex-wrap",
    },
  },
});

const tabVariants = cva(
  "flex items-center gap-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
  {
    variants: {
      variant: {
        underline: "-mb-px min-h-10 border-b-2 px-3 py-1.5",
        chips: "h-9 shrink-0 rounded-full border px-3.5 whitespace-nowrap",
      },
      isActive: { true: "", false: "" },
    },
    compoundVariants: [
      { variant: "underline", isActive: true, className: "border-orange-700 text-gray-900" },
      {
        variant: "underline",
        isActive: false,
        className: "border-transparent text-gray-500 hover:text-gray-900",
      },
      { variant: "chips", isActive: true, className: "border-navy-800 bg-navy-800 text-white" },
      {
        variant: "chips",
        isActive: false,
        className:
          "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:text-gray-900",
      },
    ],
  },
);

type QueryTabsProps = {
  label: string;
  /** The search param the tabs set, e.g. "status". */
  param: string;
  /** A null value is the "All" tab, which removes the param. */
  tabs: { value: string | null; label: string; count?: number }[];
  /** "chips" suits many filters with counts; "underline" suits a few sections. */
  variant?: "underline" | "chips";
};

/** Tabs that filter a list through one search param; switching tabs goes back to page 1. */
export function QueryTabs({ label, param, tabs, variant = "underline" }: QueryTabsProps) {
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
      <ul className={listVariants({ variant })}>
        {tabs.map((tab) => {
          const isActive = tab.value === current;
          return (
            <li key={tab.value ?? "all"} className="flex">
              <Link
                href={hrefFor(tab.value)}
                aria-current={isActive ? "page" : undefined}
                className={tabVariants({ variant, isActive })}
              >
                {/* Long underline labels wrap onto two lines, so a row of tabs fits. */}
                <span
                  className={cn(variant === "underline" && "max-w-24 text-center leading-tight")}
                >
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 text-xs tabular-nums",
                      variant === "chips" && isActive
                        ? "bg-white text-navy-800"
                        : "bg-gray-100 text-gray-700",
                    )}
                  >
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
