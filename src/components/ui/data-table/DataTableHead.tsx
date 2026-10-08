"use client";

import { FlexRender, type Header, type RowData } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { DataTableFeatures } from "@/components/ui/data-table/table-hook";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const SORT_ICONS = { asc: ArrowUp, desc: ArrowDown, none: ArrowUpDown };
const ARIA_SORT = { asc: "ascending", desc: "descending", none: undefined } as const;

type DataTableHeadProps<TData extends RowData> = {
  header: Header<DataTableFeatures, TData>;
};

/** A header cell; sortable columns render as a button that cycles the sort order. */
export function DataTableHead<TData extends RowData>({ header }: DataTableHeadProps<TData>) {
  const { column } = header;
  const isRight = column.columnDef.meta?.align === "right";
  const sorted = column.getIsSorted() || "none";
  const SortIcon = SORT_ICONS[sorted];

  if (header.isPlaceholder) return <TableHead />;

  return (
    <TableHead aria-sort={ARIA_SORT[sorted]} className={cn(isRight && "text-right")}>
      {column.getCanSort() ? (
        <button
          type="button"
          onClick={() => column.toggleSorting(sorted === "asc")}
          className={cn(
            "-mx-1 inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            sorted !== "none" && "text-gray-900",
          )}
        >
          <FlexRender header={header} />
          <SortIcon aria-hidden className="size-3.5" />
        </button>
      ) : (
        <FlexRender header={header} />
      )}
    </TableHead>
  );
}
