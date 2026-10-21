"use client";

import { Users } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { customerColumns } from "@/features/customers/components/columns";
import type { CustomerSummary } from "@/features/customers/types";
import type { Paginated } from "@/lib/types";

export function CustomersTable({ customers }: { customers: Paginated<CustomerSummary> }) {
  const { items, ...pagination } = customers;

  return (
    <DataTable
      label="Customers"
      columns={customerColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={Users}
          title="No customers match"
          description="Search by name, mobile or number plate, or add a new customer."
        />
      }
    />
  );
}
