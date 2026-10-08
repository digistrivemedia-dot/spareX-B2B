import {
  columnVisibilityFeature,
  createTableHook,
  metaHelper,
  rowSortingFeature,
  tableFeatures,
  type RowData,
  type TableOptions,
} from "@tanstack/react-table";

export type DataTableColumnMeta = {
  /** Right-aligns the column. Use for numbers and money. */
  align?: "right";
  /** On phones this column becomes the card heading instead of a labelled row. */
  isCardTitle?: boolean;
};

const features = tableFeatures({
  rowSortingFeature,
  columnVisibilityFeature,
  columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableFeatures = typeof features;

/**
 * The single table setup every DataTable shares. Feature `columns.tsx` files build their
 * columns with `createAppColumnHelper<Row>()`.
 */
export const { createAppColumnHelper, useAppTable } = createTableHook({
  features,
  getRowId: (row: { id: string }) => row.id,
  // Lists are sorted by the API (or the mock handler), never in the browser.
  manualSorting: true,
  // Columns opt in to sorting with `enableSorting: true`.
  defaultColumn: { enableSorting: false },
});

export type DataTableColumns<TData extends RowData> = TableOptions<
  DataTableFeatures,
  TData
>["columns"];

/** A column's plain-text name: its header when that is a string, else its id. */
export function getColumnLabel(column: { id: string; columnDef: { header?: unknown } }): string {
  const { header } = column.columnDef;
  return typeof header === "string" ? header : column.id;
}
