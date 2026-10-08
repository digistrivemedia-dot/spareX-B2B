import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Credit & payments",
};

export default function CreditPage() {
  return (
    <>
      <PageHeader title="Credit & payments" />
      <ComingSoon feature="credit and payments" />
    </>
  );
}
