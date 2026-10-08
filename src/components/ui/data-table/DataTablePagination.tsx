"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { Paginated } from "@/lib/types";

export type PaginationInfo = Omit<Paginated<unknown>, "items">;

/** Previous/next links that change `?page=` and keep every other filter. */
export function DataTablePagination({ page, pageSize, total }: PaginationInfo) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function hrefFor(target: number) {
    const params = new URLSearchParams(searchParams);
    if (target === 1) params.delete("page");
    else params.set("page", String(target));
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 text-sm">
      <p className="text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-900 tabular-nums">
          {formatNumber(from)}–{formatNumber(to)}
        </span>{" "}
        of <span className="font-medium text-gray-900 tabular-nums">{formatNumber(total)}</span>
      </p>
      <div className="flex items-center gap-2">
        <PageLink href={hrefFor(page - 1)} disabled={page <= 1} label="Previous page">
          <ChevronLeft aria-hidden />
        </PageLink>
        <span className="text-gray-500 tabular-nums">
          Page {page} of {pageCount}
        </span>
        <PageLink href={hrefFor(page + 1)} disabled={page >= pageCount} label="Next page">
          <ChevronRight aria-hidden />
        </PageLink>
      </div>
    </nav>
  );
}

type PageLinkProps = {
  href: string;
  disabled: boolean;
  label: string;
  children: ReactNode;
};

function PageLink({ href, disabled, label, children }: PageLinkProps) {
  if (disabled) {
    return (
      <Button variant="outline" size="icon-sm" disabled aria-label={label}>
        {children}
      </Button>
    );
  }
  return (
    <Button variant="outline" size="icon-sm" asChild>
      <Link href={href} scroll={false} aria-label={label}>
        {children}
      </Link>
    </Button>
  );
}
