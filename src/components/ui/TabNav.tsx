"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type TabNavProps = {
  label: string;
  /** The first tab is the section's root page; the others also match their sub-pages. */
  tabs: { label: string; href: string }[];
};

/** Tabs that are links to sub-pages, e.g. the Company section's profile, addresses and users. */
export function TabNav({ label, tabs }: TabNavProps) {
  const pathname = usePathname();
  const isActive = (href: string, index: number) =>
    index === 0 ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label={label} className="mb-6 overflow-x-auto border-b border-gray-200">
      <ul className="flex gap-1">
        {tabs.map((tab, index) => {
          const active = isActive(tab.href, index);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "-mb-px flex h-10 items-center border-b-2 px-3 text-sm font-medium whitespace-nowrap focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active
                    ? "border-orange-700 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-900",
                )}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
