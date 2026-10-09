import { FilePlus2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { getQuotations } from "@/features/quotations/api";
import { QuotationStatusTabs } from "@/features/quotations/components/QuotationStatusTabs";
import { QuotationsTable } from "@/features/quotations/components/QuotationsTable";
import type { QuotationSort, QuotationStatus } from "@/features/quotations/types";

export const metadata: Metadata = {
  title: "Quotations",
};

const STATUSES: QuotationStatus[] = ["requested", "quoted", "accepted", "rejected", "expired"];
const SORTS: QuotationSort[] = ["requestedAt", "validUntil"];

type QuotationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function QuotationsPage({ searchParams }: QuotationsPageProps) {
  const params = await searchParams;
  const pick = <T extends string>(value: unknown, allowed: T[]) =>
    allowed.find((option) => option === value);
  const status = pick(params.status, STATUSES);
  const page = Number(params.page);

  const quotations = await getQuotations({
    status,
    sort: pick(params.sort, SORTS),
    order: params.order === "asc" ? "asc" : "desc",
    page: Number.isInteger(page) && page > 0 ? page : 1,
  });

  return (
    <>
      <PageHeader
        title="Quotations"
        description="Ask Kannali for special prices on bulk or unusual orders, then accept to order."
        actions={
          <Button asChild>
            <Link href="/quotations/new">
              <FilePlus2 aria-hidden />
              Request quotation
            </Link>
          </Button>
        }
      />
      <QuotationStatusTabs current={status} />
      <QuotationsTable quotations={quotations} />
    </>
  );
}
