"use client";

import type { ColumnVisibilityState } from "@tanstack/react-table";
import { useState, type ReactNode } from "react";

import { DataTableCards } from "@/components/ui/data-table/DataTableCards";
import { DataTableColumnToggle } from "@/components/ui/data-table/DataTableColumnToggle";
import { DataTableHead } from "@/components/ui/data-table/DataTableHead";
import {
  DataTablePagination,
  type PaginationInfo,
} from "@/components/ui/data-table/DataTablePagination";
import { useAppTable, type DataTableColumns } from "@/components/ui/data-table/table-hook";
import { useUrlSorting } from "@/components/ui/data-table/use-url-sorting";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type DataTableProps<TData extends { id: string }> = {
  /** Accessible name for the table, e.g. "Recent orders". */
  label: string;
  columns: DataTableColumns<TData>;
  data: TData[];
  /** Shown instead of the table when there are no rows. */
  emptyState: ReactNode;
  /** For server-paginated lists. Leave out for short fixed lists. */
  pagination?: PaginationInfo;
  /** Shows a "Columns" menu so users can hide columns. */
  enableColumnToggle?: boolean;
};

/**
 * The one table used across the app. Sorting and pagination live in the URL and are applied
 * by the API; this component only renders. When its own width is under 48rem (a phone, or a
 * tablet beside the sidebar) rows become cards, so columns are never hidden off to the side.
 */
export function DataTable<TData extends { id: string }>({
  label,
  columns,
  data,
  emptyState,
  pagination,
  enableColumnToggle = false,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useUrlSorting();
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({});

  const table = useAppTable({
    columns,
    data,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  });

  if (data.length === 0) {
    return <div className="rounded-xl border border-gray-200 bg-white">{emptyState}</div>;
  }

  return (
    <div className="@container flex flex-col gap-3">
      {enableColumnToggle && (
        <div className="hidden justify-end @3xl:flex">
          <DataTableColumnToggle table={table} />
        </div>
      )}

      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm @3xl:block">
        {/* The table scrolls inside its own box (so the header can stick); 70svh keeps it on screen. */}
        <Table aria-label={label} containerClassName="max-h-[70svh]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <DataTableHead key={header.id} header={header} />
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      cell.column.columnDef.meta?.align === "right" && "text-right tabular-nums",
                    )}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DataTableCards label={label} rows={table.getRowModel().rows} className="@3xl:hidden" />

      {pagination && <DataTablePagination {...pagination} />}
    </div>
  );
}
