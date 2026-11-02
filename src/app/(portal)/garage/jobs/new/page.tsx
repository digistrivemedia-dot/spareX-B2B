import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { can } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBranches } from "@/features/company/api";
import { WalkInForm } from "@/features/job-cards/components/WalkInForm";

export const metadata: Metadata = {
  title: "New job card",
};

export default async function NewWalkInPage() {
  const session = await requirePermission("jobs:manage", ["garage"]);
  const branches = await getBranches();

  return (
    <>
      <PageHeader
        title="New job card"
        description="For a vehicle that came in without a booking. (Booked vehicles get their job card when you accept the booking.) Start with the number plate."
      />
      <WalkInForm
        branches={branches}
        defaultBranchId={session.branchId}
        canChooseBranch={can(session.roles, "garage:all_branches")}
      />
    </>
  );
}
