import { CarFront } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { QueryTabs } from "@/components/ui/QueryTabs";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBranches, getCompanyUsers } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { getJobCards } from "@/features/job-cards/api";
import { JobCardsTable } from "@/features/job-cards/components/JobCardsTable";
import { JOB_TABS, parseJobParams } from "@/features/job-cards/search-params";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Job cards",
};

type JobCardsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function JobCardsPage({ searchParams }: JobCardsPageProps) {
  const session = await requirePermission("jobs:view", ["garage"]);
  const filters = parseJobParams(await searchParams);
  const branchId = scopeToBranch(session, filters.branchId);
  const [jobs, branches, technicians] = await Promise.all([
    getJobCards({ ...filters, branchId }),
    getBranches(),
    getCompanyUsers({ role: "technician", branchId, pageSize: 50 }),
  ]);

  return (
    <>
      <PageHeader
        title="Job cards"
        description="Every vehicle in the garage, from arrival to handover."
        actions={
          can(session.roles, "jobs:manage") && (
            <Button asChild>
              <Link href="/garage/jobs/new">
                <CarFront aria-hidden />
                New walk-in
              </Link>
            </Button>
          )
        }
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
        <SearchFilter
          id="jobs-search"
          label="Search"
          placeholder="Job no., number plate or customer"
        />
        <BranchFilter branches={branches} canChoose={can(session.roles, "garage:all_branches")} />
        <FilterSelect
          param="tech"
          label="Technician"
          allLabel="All technicians"
          options={technicians.items.map((user) => ({ value: user.id, label: user.name }))}
        />
      </div>
      <QueryTabs label="Job status" param="status" tabs={JOB_TABS} />
      <JobCardsTable jobs={jobs} />
    </>
  );
}
