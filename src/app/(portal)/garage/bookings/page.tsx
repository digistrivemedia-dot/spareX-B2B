import { CalendarCheck, CalendarClock, History } from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { QueryTabs } from "@/components/ui/QueryTabs";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBookings } from "@/features/bookings/api";
import { BookingList } from "@/features/bookings/components/BookingList";
import { BookingRequestCard } from "@/features/bookings/components/BookingRequestCard";
import { getBranches } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { getParam, pickParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Bookings",
};

const VIEWS = ["upcoming", "past"] as const;

/** Enough for any day's requests; older bookings stay on the customer's history. */
const PAGE_SIZE = 50;

const EMPTY = {
  new: {
    icon: CalendarClock,
    title: "No new requests",
    description:
      "When a customer books, the request shows here and on the garage dashboard, with a timer.",
  },
  upcoming: {
    icon: CalendarCheck,
    title: "Nothing coming up",
    description: "Accepted bookings show here, by day, until their slot has passed.",
  },
  past: {
    icon: History,
    title: "No past bookings",
    description: "Declined and missed requests, and earlier accepted ones, show here.",
  },
};

type BookingsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const session = await requirePermission("bookings:manage", ["garage"]);
  const params = await searchParams;
  const branchId = scopeToBranch(session, getParam(params, "branch"));
  const view = pickParam(params, "view", VIEWS);
  const showBranch = can(session.roles, "garage:all_branches") && !branchId;
  const [requests, upcoming, past, branches] = await Promise.all([
    getBookings({ status: "new", branchId, sort: "respondBy", order: "asc", pageSize: PAGE_SIZE }),
    getBookings({ view: "upcoming", branchId, sort: "slotAt", order: "asc", pageSize: PAGE_SIZE }),
    view === "past"
      ? getBookings({ view: "past", branchId, sort: "slotAt", order: "desc", pageSize: PAGE_SIZE })
      : null,
    getBranches(),
  ]);
  const shown = view === "upcoming" ? upcoming.items : view === "past" ? (past?.items ?? []) : [];
  const empty = EMPTY[view ?? "new"];

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Requests from customers on the SpareX app. Answer each one before its timer runs out."
      />
      <div className="mb-2 flex flex-col gap-3 sm:flex-row">
        <BranchFilter branches={branches} canChoose={can(session.roles, "garage:all_branches")} />
      </div>
      <QueryTabs
        label="Bookings"
        param="view"
        tabs={[
          { value: null, label: "New requests", count: requests.total },
          { value: "upcoming", label: "Upcoming", count: upcoming.total },
          { value: "past", label: "Past" },
        ]}
      />
      {(view ? shown.length : requests.items.length) === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState icon={empty.icon} title={empty.title} description={empty.description} />
        </div>
      ) : view ? (
        <BookingList bookings={shown} showBranch={showBranch} />
      ) : (
        <ul aria-label="New requests" className="grid gap-4 lg:grid-cols-2">
          {requests.items.map((booking) => (
            <BookingRequestCard key={booking.id} booking={booking} showBranch={showBranch} />
          ))}
        </ul>
      )}
    </>
  );
}
