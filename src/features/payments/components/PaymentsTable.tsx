"use client";

import { IndianRupee } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { paymentColumns } from "@/features/payments/components/columns";
import type { Payment } from "@/features/payments/types";
import type { Paginated } from "@/lib/types";

export function PaymentsTable({ payments }: { payments: Paginated<Payment> }) {
  const { items, ...pagination } = payments;

  return (
    <DataTable
      label="Payments"
      columns={paymentColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={IndianRupee}
          title="No payments match"
          description="Try another status or method, or clear the filters."
          action={
            <Button variant="outline" asChild>
              <Link href="/payments">Clear filters</Link>
            </Button>
          }
        />
      }
    />
  );
}
