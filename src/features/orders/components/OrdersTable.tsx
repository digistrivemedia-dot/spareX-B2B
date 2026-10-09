"use client";

import { Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { orderListColumns } from "@/features/orders/components/columns";
import type { OrderSummary } from "@/features/orders/types";
import type { Paginated } from "@/lib/types";

export function OrdersTable({ orders }: { orders: Paginated<OrderSummary> }) {
  const { items, ...pagination } = orders;

  return (
    <DataTable
      label="Orders"
      columns={orderListColumns}
      data={items}
      pagination={pagination}
      enableColumnToggle
      emptyState={
        <EmptyState
          icon={Package}
          title="No orders match"
          description="Try another order or PO number, or clear the filters."
          action={
            <Button variant="outline" asChild>
              <Link href="/orders">Clear filters</Link>
            </Button>
          }
        />
      }
    />
  );
}
