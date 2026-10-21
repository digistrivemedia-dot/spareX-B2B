import type { Metadata } from "next";

import { requireSession } from "@/features/auth/session";
import { BusinessProfile } from "@/features/company/components/BusinessProfile";
import { getCreditSummary } from "@/features/credit/api";

export const metadata: Metadata = {
  title: "Business profile",
};

export default async function BusinessProfilePage() {
  const { business } = await requireSession();
  const credit = business.creditEnabled ? await getCreditSummary() : null;

  return <BusinessProfile business={business} credit={credit} />;
}
