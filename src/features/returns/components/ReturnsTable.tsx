"use client";

import { PackageOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { returnColumns } from "@/features/returns/components/columns";
import type { ReturnSummary } from "@/features/returns/types";
import type { Paginated } from "@/lib/types";

export function ReturnsTable({ returns }: { returns: Paginated<ReturnSummary> }) {
  const { items, ...pagination } = returns;

  return (
    <DataTable
      label="Returns"
      columns={returnColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={PackageOpen}
          title="No returns yet"
          description="To return parts, open a delivered order and choose Return items."
          action={
            <Button variant="outline" asChild>
              <Link href="/orders?status=delivered">Delivered orders</Link>
            </Button>
          }
        />
      }
    />
  );
}
