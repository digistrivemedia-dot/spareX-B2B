"use client";

import { Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { userColumns } from "@/features/company/components/user-columns";
import type { CompanyUser } from "@/features/company/types";
import type { Paginated } from "@/lib/types";

export function UsersTable({ users }: { users: Paginated<CompanyUser> }) {
  const { items, ...pagination } = users;

  return (
    <DataTable
      label="Users"
      columns={userColumns}
      data={items}
      pagination={pagination}
      emptyState={
        <EmptyState
          icon={Users}
          title="No one matches"
          description="Try another role or branch, or clear the filters."
          action={
            <Button variant="outline" asChild>
              <Link href="/company/users">Clear filters</Link>
            </Button>
          }
        />
      }
    />
  );
}
