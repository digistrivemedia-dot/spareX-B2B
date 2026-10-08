import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Quotation",
};

export default function QuotationPage() {
  return (
    <>
      <PageHeader title="Quotation" />
      <ComingSoon feature="quotation details" />
    </>
  );
}
