"use client";

import { FileDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createAppColumnHelper } from "@/components/ui/data-table/table-hook";
import type { BusinessDocument } from "@/features/documents/types";
import { DOCUMENT_KIND_LABELS } from "@/features/documents/utils";
import { formatDate, formatPrice } from "@/lib/format";

const column = createAppColumnHelper<BusinessDocument>();

export const documentColumns = column.columns([
  column.accessor("number", {
    header: "Number",
    meta: { isCardTitle: true },
    cell: ({ getValue }) => <span className="font-medium text-gray-900">{getValue()}</span>,
  }),
  column.accessor("kind", {
    header: "Type",
    cell: ({ getValue }) => DOCUMENT_KIND_LABELS[getValue()],
  }),
  column.accessor("date", {
    header: "Date",
    enableSorting: true,
    cell: ({ getValue }) => formatDate(getValue()),
  }),
  column.accessor("relatedTo", {
    header: "For",
    cell: ({ getValue }) => {
      const related = getValue();
      return related ? (
        <Link href={related.href} className="text-navy-700 hover:underline">
          {related.label}
        </Link>
      ) : (
        "—"
      );
    },
  }),
  column.accessor("amountInPaise", {
    header: "Amount (incl. GST)",
    meta: { align: "right" },
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-900">{formatPrice(getValue())}</span>
    ),
  }),
  column.display({
    id: "actions",
    header: () => <span className="sr-only">Download</span>,
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" asChild>
        <a href={row.original.url} download aria-label={`Download ${row.original.number}`}>
          <FileDown aria-hidden />
          PDF
        </a>
      </Button>
    ),
  }),
]);
