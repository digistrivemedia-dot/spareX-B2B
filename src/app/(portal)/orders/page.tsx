import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" />
      <ComingSoon feature="orders and invoices" />
    </>
  );
}
