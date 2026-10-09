import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { requireSession } from "@/features/auth/session";
import { getFrequentlyOrdered } from "@/features/catalog/api";
import { FrequentlyOrdered } from "@/features/catalog/components/FrequentlyOrdered";
import { getBranches } from "@/features/company/api";
import { getCreditSummary } from "@/features/credit/api";
import { AttentionBar } from "@/features/dashboard/components/AttentionBar";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { QuickActions } from "@/features/dashboard/components/QuickActions";
import { getOrders } from "@/features/orders/api";
import { RecentOrdersTable } from "@/features/orders/components/RecentOrdersTable";
import { OPEN_ORDER_STATUSES } from "@/features/orders/utils";
import { getOffers } from "@/features/promotions/api";
import { OffersCarousel } from "@/features/promotions/components/OffersCarousel";
import { getQuotations } from "@/features/quotations/api";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const [session, credit, awaiting, openOrders, recentOrders, offers, frequent, branches] =
    await Promise.all([
      requireSession(),
      getCreditSummary(),
      getQuotations({ status: "quoted", sort: "validUntil", order: "asc", pageSize: 1 }),
      getOrders({ statuses: OPEN_ORDER_STATUSES, pageSize: 1 }),
      getOrders({ sort: "placedAt", order: "desc", pageSize: 5 }),
      getOffers(),
      getFrequentlyOrdered(),
      getBranches(),
    ]);

  const firstName = session.user.name.split(" ")[0];
  const lastOrder = recentOrders.items.find((order) => order.status !== "cancelled");

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={session.business.name}
        actions={<QuickActions lastOrder={lastOrder} />}
      />
      <AttentionBar
        overdueInPaise={credit.overdueInPaise}
        overdueInvoiceCount={credit.overdueInvoiceCount}
        quotationsAwaiting={awaiting.total}
      />
      <DashboardStats
        credit={credit}
        openOrderCount={openOrders.total}
        quotationsAwaiting={awaiting.total}
        nextQuotationExpiry={awaiting.items[0]?.validUntil}
      />
      <section className="mb-8">
        <SectionHeader title="Recent orders" action={<ViewAllLink href="/orders" />} />
        <RecentOrdersTable orders={recentOrders.items} />
      </section>
      <section aria-label="Business offers" className="mb-8">
        <OffersCarousel offers={offers} />
      </section>
      <section>
        <SectionHeader title="Frequently ordered" action={<ViewAllLink href="/catalog" />} />
        <FrequentlyOrdered products={frequent} branches={branches} />
      </section>
    </>
  );
}

function ViewAllLink({ href }: { href: string }) {
  return (
    <Button variant="link" size="sm" className="px-0" asChild>
      <Link href={href}>View all</Link>
    </Button>
  );
}
