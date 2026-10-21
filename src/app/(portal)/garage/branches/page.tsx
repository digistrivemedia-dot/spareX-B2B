import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { requirePermission } from "@/features/auth/session";
import { AddBranchButton } from "@/features/company/components/AddBranchButton";
import { getGarageBranches, getGarageProfile } from "@/features/garage/api";
import { BranchesTable } from "@/features/garage/components/BranchesTable";
import { summariseHours } from "@/features/garage/utils";

export const metadata: Metadata = {
  title: "Branches",
};

export default async function BranchesPage() {
  await requirePermission("garage:setup", ["garage"]);
  const [branches, profile] = await Promise.all([getGarageBranches(), getGarageProfile()]);

  return (
    <>
      <PageHeader
        title="Branches"
        description="Where your garage works. Each branch is also a delivery address for parts."
        actions={<AddBranchButton label="Add branch" />}
      />
      <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-gray-700">
        <Clock aria-hidden className="size-4 text-navy-700" />
        Every branch is open {summariseHours(profile.openingHours)}.
        <Link href="/garage/profile" className="font-medium text-navy-700 hover:underline">
          Change hours
        </Link>
      </p>
      <BranchesTable branches={branches} />
    </>
  );
}
