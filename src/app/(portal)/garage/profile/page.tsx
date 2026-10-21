import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { requirePermission } from "@/features/auth/session";
import { getGarageProfile } from "@/features/garage/api";
import { GarageProfileForm } from "@/features/garage/components/GarageProfileForm";

export const metadata: Metadata = {
  title: "Garage profile",
};

export default async function GarageProfilePage() {
  await requirePermission("garage:setup", ["garage"]);
  const profile = await getGarageProfile();

  return (
    <>
      <PageHeader
        title="Garage profile"
        description="What customers see when they book a service with you. It applies to every branch."
      />
      <GarageProfileForm profile={profile} />
    </>
  );
}
