import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { QueryTabs } from "@/components/ui/QueryTabs";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBookings } from "@/features/bookings/api";
import { BookingsTable } from "@/features/bookings/components/BookingsTable";
import type { BookingStatus } from "@/features/bookings/types";
import { getBranches } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { getParam, parsePage, pickParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Bookings",
};

const STATUSES: BookingStatus[] = ["new", "accepted", "declined"];

type BookingsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const session = await requirePermission("bookings:manage", ["garage"]);
  const params = await searchParams;
  const branchId = scopeToBranch(session, getParam(params, "branch"));
  const status = pickParam(params, "status", STATUSES);
  const [bookings, newOnes, branches] = await Promise.all([
    getBookings({
      status,
      branchId,
      order: params.order === "desc" ? "desc" : "asc",
      page: parsePage(params),
    }),
    getBookings({ status: "new", branchId, pageSize: 1 }),
    getBranches(),
  ]);

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Service bookings from customers on the SpareX app. Accept to confirm the slot, or decline with a reason."
      />
      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <BranchFilter branches={branches} canChoose={can(session.roles, "garage:all_branches")} />
      </div>
      <QueryTabs
        label="Booking status"
        param="status"
        tabs={[
          { value: "new", label: "New", count: newOnes.total },
          { value: "accepted", label: "Accepted" },
          { value: "declined", label: "Declined" },
          { value: null, label: "All" },
        ]}
      />
      <BookingsTable bookings={bookings} />
    </>
  );
}
