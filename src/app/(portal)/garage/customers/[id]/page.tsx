import { CarFront } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionCard } from "@/components/ui/SectionCard";
import { requirePermission } from "@/features/auth/session";
import { getCustomer } from "@/features/customers/api";
import { VehicleHistoryCard } from "@/features/customers/components/VehicleHistoryCard";
import { formatDate, formatPhone } from "@/lib/format";

type CustomerPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CustomerPageProps): Promise<Metadata> {
  const customer = await getCustomer((await params).id);
  return { title: customer ? customer.name : "Customer not found" };
}

export default async function CustomerPage({ params }: CustomerPageProps) {
  await requirePermission("customers:view", ["garage"]);
  const customer = await getCustomer((await params).id);
  if (!customer) notFound();

  return (
    <>
      <PageHeader title={customer.name} description={formatPhone(customer.phone)} />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <aside className="xl:sticky xl:top-20 xl:order-last xl:w-80 xl:shrink-0">
          <SectionCard title="Customer">
            <DetailList>
              <DetailItem label="Mobile">{formatPhone(customer.phone)}</DetailItem>
              {customer.email && <DetailItem label="Email">{customer.email}</DetailItem>}
              <DetailItem label="Customer since">{formatDate(customer.createdAt)}</DetailItem>
              <DetailItem label="SpareX app">
                {customer.hasAppAccount
                  ? "Uses the app: their own records link to these vehicles by plate"
                  : "Not on the app yet. If they add a plate later, this history links to them."}
              </DetailItem>
            </DetailList>
          </SectionCard>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          {customer.vehicles.length ? (
            customer.vehicles.map((vehicle) => (
              <VehicleHistoryCard key={vehicle.id} vehicle={vehicle} />
            ))
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <EmptyState
                icon={CarFront}
                title="No vehicles yet"
                description="A vehicle is added the first time it comes in, by its number plate."
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
