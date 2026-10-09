"use client";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { quotationLineColumns } from "@/features/quotations/components/line-columns";
import type { QuotationLine } from "@/features/quotations/types";

/** All prices excl. GST. */
export function QuotationLinesTable({ lines }: { lines: QuotationLine[] }) {
  return (
    <DataTable
      label="Quoted parts"
      columns={quotationLineColumns}
      data={lines.map((line) => ({ ...line, id: line.productId }))}
      emptyState={null}
      density="compact"
    />
  );
}
