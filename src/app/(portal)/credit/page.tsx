import { Download, WalletCards } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from "@/components/ui/DateRangeFilter";
import { EmptyState } from "@/components/ui/EmptyState";
import { requireSession } from "@/features/auth/session";
import { getCreditSummary, getStatement, getUnpaidInvoices } from "@/features/credit/api";
import { CreditSummaryCards } from "@/features/credit/components/CreditSummaryCards";
import { DuesTable } from "@/features/credit/components/DuesTable";
import { PayDuesProvider } from "@/features/credit/components/PayDuesProvider";
import { PayNowButton } from "@/features/credit/components/PayNowButton";
import { StatementTable } from "@/features/credit/components/StatementTable";
import { parseDateRange, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Credit",
};

type CreditPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function CreditPage({ searchParams }: CreditPageProps) {
  const { business } = await requireSession();
  if (!business.creditEnabled) {
    return (
      <>
        <PageHeader title="Credit" />
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={WalletCards}
            title="Credit isn't enabled for your account"
            description="Kannali offers credit to regular business buyers. Ask your account manager if you'd like to apply."
          />
        </div>
      </>
    );
  }

  const range = parseDateRange(await searchParams);
  const [credit, invoices, statement] = await Promise.all([
    getCreditSummary(),
    getUnpaidInvoices(),
    getStatement(range),
  ]);
  // The download covers the same dates as the table.
  const query = new URLSearchParams();
  if (range.from) query.set("from", range.from);
  if (range.to) query.set("to", range.to);

  return (
    <PayDuesProvider invoices={invoices}>
      <PageHeader
        title="Credit"
        description={`Your credit account with Kannali: Net ${credit.termsDays} terms, amounts incl. GST.`}
        actions={<PayNowButton invoices={invoices} />}
      />
      <CreditSummaryCards credit={credit} />
      <section className="mb-8">
        <SectionHeader title="Upcoming and overdue" />
        <DuesTable invoices={invoices} />
      </section>
      <section>
        <SectionHeader
          title="Statement"
          action={
            <Button variant="outline" size="sm" asChild>
              <a href={`/credit/statement.csv${query.size ? `?${query}` : ""}`} download>
                <Download aria-hidden />
                Download statement
              </a>
            </Button>
          }
        />
        <div className="mb-4">
          <DateRangeFilter id="statement" />
        </div>
        <StatementTable statement={statement} />
      </section>
    </PayDuesProvider>
  );
}
