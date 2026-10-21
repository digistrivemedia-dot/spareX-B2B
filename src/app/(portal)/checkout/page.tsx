import { FileX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireSession } from "@/features/auth/session";
import { CheckoutView } from "@/features/checkout/components/CheckoutView";
import { QuotationCheckout } from "@/features/checkout/components/QuotationCheckout";
import { getCreditSummary } from "@/features/credit/api";
import { getQuotation } from "@/features/quotations/api";
import { describeValidity } from "@/features/quotations/utils";

export const metadata: Metadata = {
  title: "Checkout",
};

type CheckoutPageProps = {
  /** `?quotation=<id>` checks out an accepted quotation instead of the cart. */
  searchParams: Promise<{ quotation?: string | string[] }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const [{ business }, { quotation: quotationId }] = await Promise.all([
    requireSession(),
    searchParams,
  ]);
  const credit = business.creditEnabled ? await getCreditSummary() : null;

  if (typeof quotationId !== "string") {
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

  const quotation = await getQuotation(quotationId);
  if (!quotation) notFound();
  const isOrderable =
    quotation.status === "quoted" &&
    (!quotation.validUntil || describeValidity(quotation.validUntil).daysLeft >= 0);

  return (
    <>
      <PageHeader
        title={`Checkout: ${quotation.number}`}
        description="The quoted parts at the quoted prices. Add your PO number so it prints on the invoice."
      />
      {isOrderable ? (
        <QuotationCheckout quotation={quotation} credit={credit} />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={FileX}
            title="This quotation can't be ordered"
            description="It has already been accepted, rejected or sent back for revision, or it has expired."
            action={
              <Button variant="outline" asChild>
                <Link href={`/quotations/${quotation.id}`}>View quotation</Link>
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
