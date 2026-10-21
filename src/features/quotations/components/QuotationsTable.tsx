"use client";

import { FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { quotationColumns } from "@/features/quotations/components/columns";
import type { QuotationSummary } from "@/features/quotations/types";
import type { Paginated } from "@/lib/types";

export function QuotationsTable({ quotations }: { quotations: Paginated<QuotationSummary> }) {
  const { items, ...pagination } = quotations;

  return (
    <DataTable
      label="Quotations"
      columns={quotationColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={FileText}
          title="No quotations here"
          description="Request a quotation for any list of parts. It's priced straight away and valid for 7 days."
          action={
            <Button asChild>
              <Link href="/quotations/new">Request quotation</Link>
            </Button>
          }
        />
      }
    />
  );
}
