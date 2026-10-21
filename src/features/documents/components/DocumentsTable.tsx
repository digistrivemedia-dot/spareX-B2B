"use client";

import { Files } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { documentColumns } from "@/features/documents/components/columns";
import type { BusinessDocument } from "@/features/documents/types";
import type { Paginated } from "@/lib/types";

export function DocumentsTable({ documents }: { documents: Paginated<BusinessDocument> }) {
  const { items, ...pagination } = documents;

  return (
    <DataTable
      label="Invoices and documents"
      columns={documentColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={Files}
          title="No documents match"
          description="Try another number, type or date range, or clear the filters."
          action={
            <Button variant="outline" asChild>
              <Link href="/invoices">Clear filters</Link>
            </Button>
          }
        />
      }
    />
  );
}
