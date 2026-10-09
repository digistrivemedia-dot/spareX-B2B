import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getCreditSummary } from "@/features/credit/api";
import { getQuotation } from "@/features/quotations/api";
import { QuotationDetail } from "@/features/quotations/components/QuotationDetail";
import { formatDate } from "@/lib/format";

type QuotationPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: QuotationPageProps): Promise<Metadata> {
  const quotation = await getQuotation((await params).id);
  return { title: quotation ? `Quotation ${quotation.number}` : "Quotation not found" };
}

export default async function QuotationPage({ params }: QuotationPageProps) {
  const { id } = await params;
  const [quotation, credit] = await Promise.all([getQuotation(id), getCreditSummary()]);
  if (!quotation) notFound();

  return (
    <>
      <PageHeader
        title={quotation.number}
        description={`Requested ${formatDate(quotation.requestedAt)} · delivering to ${quotation.branch.name}`}
      />
      <QuotationDetail quotation={quotation} termsDays={credit.termsDays} />
    </>
  );
}
