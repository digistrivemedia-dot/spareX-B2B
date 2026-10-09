"use client";

import { Package } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { orderColumns } from "@/features/orders/components/columns";
import type { OrderSummary } from "@/features/orders/types";

export function RecentOrdersTable({ orders }: { orders: OrderSummary[] }) {
  return (
    <DataTable
      label="Recent orders"
      columns={orderColumns}
      data={orders}
      emptyState={
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your orders will appear here as soon as you place one."
          action={
            <Button asChild>
              <Link href="/quick-order">Start a quick order</Link>
            </Button>
          }
        />
      }
    />
  );
}
