import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Company",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader title="Company" />
      <ComingSoon feature="your company profile" />
    </>
  );
}
