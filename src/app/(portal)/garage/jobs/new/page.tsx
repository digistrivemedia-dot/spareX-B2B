import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { can } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBranches } from "@/features/company/api";
import { WalkInForm } from "@/features/job-cards/components/WalkInForm";

export const metadata: Metadata = {
  title: "New walk-in",
};

export default async function NewWalkInPage() {
  const session = await requirePermission("jobs:manage", ["garage"]);
  const branches = await getBranches();

  return (
    <>
      <PageHeader
        title="New walk-in"
        description="A vehicle that came in without a booking. Start with its number plate."
      />
      <WalkInForm
        branches={branches}
        defaultBranchId={session.branchId}
        canChooseBranch={can(session.roles, "garage:all_branches")}
      />
    </>
  );
}
