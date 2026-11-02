import { FilePlus2 } from "lucide-react";
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
import { JobQueue } from "@/features/job-cards/components/JobQueue";
import { JOB_TABS, parseJobParams, statusesFor } from "@/features/job-cards/search-params";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Job cards",
};

/** Finished tabs can grow without limit, so only the open work is counted. */
const COUNTED_TABS = JOB_TABS.filter((tab) => tab.value !== "completed" && tab.value !== "closed");

type JobCardsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function JobCardsPage({ searchParams }: JobCardsPageProps) {
  const session = await requirePermission("jobs:view", ["garage"]);
  const filters = parseJobParams(await searchParams);
  const branchId = scopeToBranch(session, filters.branchId);
  const canSeeAllBranches = can(session.roles, "garage:all_branches");
  const [jobs, branches, technicians, counts] = await Promise.all([
    getJobCards({ ...filters, branchId }),
    getBranches(),
    getCompanyUsers({ role: "technician", branchId, pageSize: 50 }),
    Promise.all(
      COUNTED_TABS.map((tab) =>
        getJobCards({
          statuses: statusesFor(tab.value),
          branchId,
          technicianId: filters.technicianId,
          pageSize: 1,
        }),
      ),
    ),
  ]);
  const tabs = JOB_TABS.map((tab) => {
    const index = COUNTED_TABS.indexOf(tab);
    return index === -1 ? tab : { ...tab, count: counts[index].total };
  });

  return (
    <>
      <PageHeader
        title="Job cards"
        description="Every vehicle in the garage, most urgent first, with its next step."
        actions={
          can(session.roles, "jobs:manage") && (
            <Button asChild>
              <Link href="/garage/jobs/new">
                <FilePlus2 aria-hidden />
                New job card
              </Link>
            </Button>
          )
        }
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end">
        <SearchFilter
          id="jobs-search"
          label="Search"
          placeholder="Number plate, customer or job no."
        />
        <BranchFilter branches={branches} canChoose={canSeeAllBranches} />
        <FilterSelect
          param="tech"
          label="Technician"
          allLabel="All technicians"
          options={technicians.items.map((user) => ({ value: user.id, label: user.name }))}
        />
      </div>
      <QueryTabs label="Stage" param="status" tabs={tabs} variant="chips" />
      <JobQueue jobs={jobs} roles={session.roles} showBranch={canSeeAllBranches && !branchId} />
    </>
  );
}
