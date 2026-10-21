"use client";

import { ClipboardList } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { jobColumns } from "@/features/job-cards/components/columns";
import type { JobCardSummary } from "@/features/job-cards/types";
import type { Paginated } from "@/lib/types";

export function JobCardsTable({ jobs }: { jobs: Paginated<JobCardSummary> }) {
  const { items, ...pagination } = jobs;

  return (
    <DataTable
      label="Job cards"
      columns={jobColumns}
      data={items}
      pagination={pagination}
      enableColumnToggle
      emptyState={
        <EmptyState
          icon={ClipboardList}
          title="No job cards match"
          description="Try another status, technician or search, or open a walk-in job."
        />
      }
    />
  );
}
