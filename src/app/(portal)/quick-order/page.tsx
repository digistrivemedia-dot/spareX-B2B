import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Quick order",
};

export default function QuickOrderPage() {
  return (
    <>
      <PageHeader title="Quick order" />
      <ComingSoon feature="quick ordering by part number" />
    </>
  );
}
