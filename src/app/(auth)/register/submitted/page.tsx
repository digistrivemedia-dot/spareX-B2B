import type { Metadata } from "next";

import { ApplicationReceived } from "@/features/auth/components/ApplicationReceived";

export const metadata: Metadata = {
  title: "Application received",
};

type RegistrationSubmittedPageProps = {
  searchParams: Promise<{ ref?: string | string[] }>;
};

export default async function RegistrationSubmittedPage({
  searchParams,
}: RegistrationSubmittedPageProps) {
  const { ref } = await searchParams;
  return <ApplicationReceived referenceNumber={typeof ref === "string" ? ref : undefined} />;
}
