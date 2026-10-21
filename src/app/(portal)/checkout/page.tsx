import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { requireSession } from "@/features/auth/session";
import { CheckoutView } from "@/features/checkout/components/CheckoutView";
import { getCreditSummary } from "@/features/credit/api";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function CheckoutPage() {
  const { business } = await requireSession();
  const credit = business.creditEnabled ? await getCreditSummary() : null;

  return (
    <>
      <PageHeader
        title="Checkout"
        description="One delivery branch per order. Add your PO number so it prints on the invoice."
      />
      <CheckoutView credit={credit} />
    </>
  );
}
