import { CalendarCheck, CarFront, PartyPopper } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBookings } from "@/features/bookings/api";
import { BookingRequestCard } from "@/features/bookings/components/BookingRequestCard";
import { getBranches } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { GarageStats } from "@/features/garage/components/GarageStats";
import { TodayList } from "@/features/garage/components/TodayList";
import { getJobCards } from "@/features/job-cards/api";
import { StageBadge } from "@/features/job-cards/components/StageBadge";
import type { JobStatus } from "@/features/job-cards/types";
import { getNextAction, JOB_STATUS_GROUPS, type JobStatusGroup } from "@/features/job-cards/utils";
import { indiaDateFromToday } from "@/lib/dates";
import { formatTimeOfDay } from "@/lib/format";
import { getParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Garage dashboard",
};

/** How many jobs needing action the dashboard lists. */
const NEEDS_ACTION_LIMIT = 8;

/** Jobs waiting on the garage itself, not on the customer or a technician. */
const NEEDS_ACTION: JobStatus[] = [
  "confirmed",
  "out_for_pickup",
  "vehicle_received",
  "job_card_created",
  "approved",
  "quality_check",
  "ready",
  "payment_pending",
  "paid",
  "out_for_delivery",
];

type GarageDashboardProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function GarageDashboardPage({ searchParams }: GarageDashboardProps) {
  const session = await requirePermission("garage:dashboard", ["garage"]);
  const branchId = scopeToBranch(session, getParam(await searchParams, "branch"));
  const canBook = can(session.roles, "bookings:manage");
  const canManage = can(session.roles, "jobs:manage");
  const groups = Object.keys(JOB_STATUS_GROUPS) as JobStatusGroup[];
  const [newBookings, todaysBookings, groupCounts, needsAction, branches] = await Promise.all([
    getBookings({ status: "new", branchId, sort: "respondBy", order: "asc", pageSize: 10 }),
    getBookings({ date: indiaDateFromToday(0), branchId, pageSize: 20 }),
    Promise.all(
      groups.map((group) =>
        getJobCards({ statuses: JOB_STATUS_GROUPS[group].statuses, branchId, pageSize: 1 }),
      ),
    ),
    // Fetches more than it shows: only the jobs whose next step this person may take are listed.
    getJobCards({ statuses: NEEDS_ACTION, branchId, order: "asc", pageSize: 100 }),
    getBranches(),
  ]);
  const jobCounts = Object.fromEntries(
    groups.map((group, index) => [group, groupCounts[index].total]),
  ) as Record<JobStatusGroup, number>;
  const myActions = needsAction.items
    .map((job) => ({ job, action: getNextAction(job) }))
    .filter(({ action }) => action && can(session.roles, action.permission))
    .slice(0, NEEDS_ACTION_LIMIT);

  return (
    <>
      <PageHeader
        title="Garage dashboard"
        description="Today across your garage. Numbers open the lists behind them."
        actions={
          canManage && (
            <Button asChild>
              <Link href="/garage/jobs/new">
                <CarFront aria-hidden />
                New job card
              </Link>
            </Button>
          )
        }
      />
      <div className="mb-6 flex">
        <BranchFilter branches={branches} canChoose={can(session.roles, "garage:all_branches")} />
      </div>
      {canBook && newBookings.items.length > 0 && (
        <section aria-label="New booking requests" className="mb-8">
          <SectionHeader title="New booking requests" />
          <ul className="grid gap-4 lg:grid-cols-2">
            {newBookings.items.map((booking) => (
              <BookingRequestCard
                key={booking.id}
                booking={booking}
                showBranch={can(session.roles, "garage:all_branches") && !branchId}
              />
            ))}
          </ul>
        </section>
      )}
      <GarageStats
        newBookings={canBook ? newBookings.total : undefined}
        jobCounts={jobCounts}
        branchId={branchId}
      />
      <div className="grid gap-8 xl:grid-cols-2">
        {canBook && (
          <section>
            <SectionHeader title="Today's bookings" />
            <TodayList
              items={todaysBookings.items
                .filter((booking) => booking.status === "accepted")
                .map((booking) => ({
                  id: booking.id,
                  href: `/garage/bookings/${booking.id}`,
                  lead: formatTimeOfDay(booking.slotAt),
                  title: `${booking.customer.name} · ${booking.vehicle.make} ${booking.vehicle.model}`,
                  plate: booking.vehicle.plate,
                  badge: <StatusBadge status={booking.status} />,
                }))}
              empty={{
                icon: CalendarCheck,
                title: "No bookings today",
                description: "New bookings from the SpareX app show up here.",
              }}
            />
          </section>
        )}
        <section>
          <SectionHeader title="Jobs needing action" />
          <TodayList
            items={myActions.map(({ job, action }) => ({
              id: job.id,
              href: action?.href ?? `/garage/jobs/${job.id}`,
              lead: job.number.slice(-4),
              title: `${job.customer.name} · ${job.vehicle.make} ${job.vehicle.model}`,
              plate: job.vehicle.plate,
              badge: <StageBadge status={job.status} />,
              action: action?.label ?? "Open job",
            }))}
            empty={{
              icon: PartyPopper,
              title: "Nothing waiting on you",
              description: "Jobs that need the next step show up here.",
            }}
            footer={
              <Button variant="link" size="sm" className="px-0" asChild>
                <Link href="/garage/jobs">All open jobs</Link>
              </Button>
            }
          />
        </section>
      </div>
    </>
  );
}
