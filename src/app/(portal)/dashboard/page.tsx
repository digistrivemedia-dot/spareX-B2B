import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <ComingSoon feature="your dashboard" />
    </>
  );
}
