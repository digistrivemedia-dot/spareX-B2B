import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { SearchFilter } from "@/components/ui/SearchFilter";
import { requirePermission } from "@/features/auth/session";
import { getCustomers } from "@/features/customers/api";
import { AddCustomerDialog } from "@/features/customers/components/AddCustomerDialog";
import { CustomersTable } from "@/features/customers/components/CustomersTable";
import { getParam, parsePage, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Customers",
};

type CustomersPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function CustomersPage({ searchParams }: CustomersPageProps) {
  await requirePermission("customers:view", ["garage"]);
  const params = await searchParams;
  const customers = await getCustomers({ q: getParam(params, "q"), page: parsePage(params) });

  return (
    <>
      <PageHeader
        title="Customers"
        description="Everyone whose vehicle you've serviced, from bookings and walk-ins."
        actions={<AddCustomerDialog />}
      />
      <div className="mb-4 flex">
        <SearchFilter
          id="customers-search"
          label="Search"
          placeholder="Name, mobile or number plate"
        />
      </div>
      <CustomersTable customers={customers} />
    </>
  );
}
