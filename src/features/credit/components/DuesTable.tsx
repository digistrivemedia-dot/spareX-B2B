"use client";

import { PartyPopper } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { dueColumns } from "@/features/credit/components/dues-columns";
import type { Invoice } from "@/features/credit/types";

export function DuesTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <DataTable
      label="Upcoming and overdue invoices"
      columns={dueColumns}
      data={invoices}
      emptyState={
        <EmptyState
          icon={PartyPopper}
          title="Nothing to pay"
          description="Every credit invoice is paid. New invoices appear here when orders ship."
        />
      }
    />
  );
}
