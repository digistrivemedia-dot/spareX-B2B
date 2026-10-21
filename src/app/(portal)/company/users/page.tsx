import { UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { ROLE_LABELS, ROLES } from "@/features/auth/roles";
import { requirePermission } from "@/features/auth/session";
import { getBranches, getCompanyUsers } from "@/features/company/api";
import { UsersTable } from "@/features/company/components/UsersTable";
import { getParam, parsePage, pickParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Users",
};

type UsersPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function UsersPage({ searchParams }: UsersPageProps) {
  await requirePermission("users:manage", ["garage"]);
  const params = await searchParams;
  const [users, branches] = await Promise.all([
    getCompanyUsers({
      role: pickParam(params, "role", ROLES),
      branchId: getParam(params, "branch"),
      page: parsePage(params),
    }),
    getBranches(),
  ]);

  return (
    <section>
      <SectionHeader
        title="Users"
        action={
          <Button asChild>
            <Link href="/company/users/new">
              <UserPlus aria-hidden />
              Add user
            </Link>
          </Button>
        }
      />
      <p className="mb-4 text-sm text-gray-500">
        Everyone at your garage gets their own login. Each person works at one branch and sees only
        that branch&apos;s jobs.
      </p>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <FilterSelect
          param="role"
          label="Role"
          allLabel="All roles"
          options={ROLES.map((value) => ({ value, label: ROLE_LABELS[value] }))}
        />
        <FilterSelect
          param="branch"
          label="Branch"
          allLabel="All branches"
          options={branches.map((branch) => ({ value: branch.id, label: branch.name }))}
        />
      </div>
      <UsersTable users={users} />
    </section>
  );
}
