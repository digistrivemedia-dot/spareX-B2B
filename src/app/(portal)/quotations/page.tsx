import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Quotations",
};

export default function QuotationsPage() {
  return (
    <>
      <PageHeader title="Quotations" />
      <ComingSoon feature="quotations" />
    </>
  );
}
