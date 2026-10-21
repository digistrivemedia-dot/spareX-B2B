import {
  CalendarPlus,
  CarFront,
  ClipboardCheck,
  IndianRupee,
  MessageSquareWarning,
  Wrench,
} from "lucide-react";

import { StatCard } from "@/components/ui/StatCard";
import type { JobStatusGroup } from "@/features/job-cards/utils";

type GarageStatsProps = {
  newBookings: number;
  jobCounts: Record<JobStatusGroup, number>;
  /** Keeps the owner's branch choice on the lists the cards open. */
  branchQuery: string;
};

/** Today at a glance; each number opens the list behind it. */
export function GarageStats({ newBookings, jobCounts, branchQuery }: GarageStatsProps) {
  const jobs = (group: JobStatusGroup) => `/garage/jobs?status=${group}${branchQuery}`;

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      <StatCard
        label="New bookings"
        value={newBookings}
        icon={CalendarPlus}
        href={`/garage/bookings?status=new${branchQuery}`}
        description="Waiting for you to accept"
      />
      <StatCard
        label="Received"
        value={jobCounts.received}
        icon={CarFront}
        href={jobs("received")}
        description="In the garage, not yet estimated"
      />
      <StatCard
        label="Awaiting approval"
        value={jobCounts.awaiting_approval}
        icon={MessageSquareWarning}
        href={jobs("awaiting_approval")}
        description="Estimates with the customer"
      />
      <StatCard
        label="In progress"
        value={jobCounts.in_progress}
        icon={Wrench}
        href={jobs("in_progress")}
        description="Being worked on or checked"
      />
      <StatCard
        label="Ready"
        value={jobCounts.ready}
        icon={ClipboardCheck}
        href={jobs("ready")}
        description="Passed QA, to be billed"
      />
      <StatCard
        label="Payment pending"
        value={jobCounts.payment_pending}
        icon={IndianRupee}
        href={jobs("payment_pending")}
        description="Invoiced, not yet paid"
      />
    </div>
  );
}
