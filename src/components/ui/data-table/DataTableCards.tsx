"use client";

import { FlexRender, type Row, type RowData } from "@tanstack/react-table";

import { getColumnLabel, type DataTableFeatures } from "@/components/ui/data-table/table-hook";
import { cn } from "@/lib/utils";

type DataTableCardsProps<TData extends RowData> = {
  label: string;
  rows: Row<DataTableFeatures, TData>[];
  className?: string;
};

/** The phone layout of a DataTable: one card per row, columns as label/value pairs. */
export function DataTableCards<TData extends RowData>({
  label,
  rows,
  className,
}: DataTableCardsProps<TData>) {
  return (
    <ul aria-label={label} className={cn("flex flex-col gap-3", className)}>
      {rows.map((row) => {
        const cells = row.getVisibleCells();
        const title = cells.find((cell) => cell.column.columnDef.meta?.isCardTitle);
        const actions = cells.find((cell) => cell.column.id === "actions");
        const details = cells.filter((cell) => cell !== title && cell !== actions);

        return (
          <li key={row.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {title && (
              <div className="mb-3 font-medium text-gray-900">
                <FlexRender cell={title} />
              </div>
            )}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {details.map((cell) => (
                <div key={cell.id} className="contents">
                  <dt className="text-gray-500">{getColumnLabel(cell.column)}</dt>
                  <dd className="text-right text-gray-900 tabular-nums">
                    <FlexRender cell={cell} />
                  </dd>
                </div>
              ))}
            </dl>
            {actions && (
              <div className="mt-3 flex justify-end border-t border-gray-100 pt-3">
                <FlexRender cell={actions} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
