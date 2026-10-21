import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { FilterSelect } from "@/components/ui/FilterSelect";
import type { PaymentMethod } from "@/features/orders/types";
import { PAYMENT_METHOD_LABELS } from "@/features/orders/utils";
import { getPayments } from "@/features/payments/api";
import { PaymentsTable } from "@/features/payments/components/PaymentsTable";
import type { PaymentRecordStatus } from "@/features/payments/types";
import { PAYMENT_STATUS_LABELS } from "@/features/payments/utils";
import { parsePage, pickParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Payments",
};

const STATUSES = Object.keys(PAYMENT_STATUS_LABELS) as PaymentRecordStatus[];
const METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

type PaymentsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
  const params = await searchParams;
  const payments = await getPayments({
    status: pickParam(params, "status", STATUSES),
    method: pickParam(params, "method", METHODS),
    order: params.order === "asc" ? "asc" : "desc",
    page: parsePage(params),
  });

  return (
    <>
      <PageHeader
        title="Payments"
        description="Every payment you've made to Kannali: orders paid up front and credit invoices."
      />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <FilterSelect
          param="status"
          label="Status"
          allLabel="All statuses"
          options={STATUSES.map((value) => ({ value, label: PAYMENT_STATUS_LABELS[value] }))}
        />
        <FilterSelect
          param="method"
          label="Method"
          allLabel="All methods"
          options={METHODS.filter((value) => value !== "credit").map((value) => ({
            value,
            label: PAYMENT_METHOD_LABELS[value],
          }))}
        />
      </div>
      <PaymentsTable payments={payments} />
    </>
  );
}
