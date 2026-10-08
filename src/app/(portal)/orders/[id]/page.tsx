import type { Metadata } from "next";

import { ComingSoon } from "@/components/layout/ComingSoon";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Order",
};

export default function OrderPage() {
  return (
    <>
      <PageHeader title="Order" />
      <ComingSoon feature="order details" />
    </>
  );
}
