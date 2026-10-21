import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { requirePermission } from "@/features/auth/session";
import { getCompanyUser } from "@/features/company/api";
import { UserAccessPanel } from "@/features/company/components/UserAccessPanel";
import { UserForm } from "@/features/company/components/UserForm";

type UserPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const user = await getCompanyUser((await params).id);
  return { title: user ? user.name : "User not found" };
}

export default async function UserPage({ params }: UserPageProps) {
  await requirePermission("users:manage", ["garage"]);
  const user = await getCompanyUser((await params).id);
  if (!user) notFound();

  return (
    <section className="flex max-w-3xl flex-col gap-6">
      <SectionHeader title={user.name} />
      <UserAccessPanel user={user} />
      <UserForm user={user} />
    </section>
  );
}
