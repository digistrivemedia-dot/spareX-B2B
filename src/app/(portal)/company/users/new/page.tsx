import type { Metadata } from "next";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { requirePermission } from "@/features/auth/session";
import { UserForm } from "@/features/company/components/UserForm";

export const metadata: Metadata = {
  title: "Add user",
};

export default async function NewUserPage() {
  await requirePermission("users:manage", ["garage"]);

  return (
    <section className="max-w-3xl">
      <SectionHeader title="Add user" />
      <UserForm />
    </section>
  );
}
