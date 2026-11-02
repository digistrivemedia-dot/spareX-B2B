import {
  CalendarClock,
  CalendarPlus,
  CarFront,
  ClipboardCheck,
  IndianRupee,
  KeyRound,
  MessageSquareWarning,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import { JOB_STATUS_GROUPS, type JobStatusGroup } from "@/features/job-cards/utils";

const GROUP_ICONS: Record<JobStatusGroup, LucideIcon> = {
  arriving: CalendarClock,
  on_the_road: Truck,
  to_estimate: CarFront,
  awaiting_approval: MessageSquareWarning,
  servicing: Wrench,
  ready: ClipboardCheck,
  payment_pending: IndianRupee,
  paid: KeyRound,
};

type GarageStatsProps = {
  /** Left out for people who don't handle bookings. */
  newBookings?: number;
  jobCounts: Record<JobStatusGroup, number>;
  /** Keeps the owner's branch choice on the lists the cards open. */
  branchId?: string;
};

/** A list's address with its filters, leaving out the ones not set. */
function listHref(path: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString();
  return query ? `${path}?${query}` : path;
}

/** Every step of the garage at a glance; each number opens the list behind it. */
export function GarageStats({ newBookings, jobCounts, branchId }: GarageStatsProps) {
  const groups = Object.entries(JOB_STATUS_GROUPS) as [
    JobStatusGroup,
    (typeof JOB_STATUS_GROUPS)[JobStatusGroup],
  ][];

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {newBookings !== undefined && (
        <StatCard
          label="New bookings"
          value={newBookings}
          icon={CalendarPlus}
          href={listHref("/garage/bookings", { branch: branchId })}
          description="Accept or decline"
        />
      )}
      {groups.map(([group, { label, description }]) => (
        <StatCard
          key={group}
          label={label}
          value={jobCounts[group]}
          icon={GROUP_ICONS[group]}
          href={listHref("/garage/jobs", { status: group, branch: branchId })}
          description={description}
        />
      ))}
    </div>
  );
}
