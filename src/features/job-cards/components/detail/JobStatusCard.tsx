import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { JobCard } from "@/features/job-cards/types";
import { getNextAction } from "@/features/job-cards/utils";
import { formatDateTime } from "@/lib/format";

/** Where the job stands, and the one thing to do next. */
export function JobStatusCard({ job }: { job: JobCard }) {
  const next = getNextAction(job);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <StatusBadge status={job.status} className="self-start" />
        <DetailList>
          <DetailItem label="Branch">{job.branch.name}</DetailItem>
          <DetailItem label="Opened">
            {formatDateTime(job.createdAt)} · {job.source === "walk_in" ? "walk-in" : "booking"}
          </DetailItem>
          {job.scheduledAt && job.status === "confirmed" && (
            <DetailItem label="Due in">{formatDateTime(job.scheduledAt)}</DetailItem>
          )}
          {job.promisedAt && (
            <DetailItem label="Promised for">{formatDateTime(job.promisedAt)}</DetailItem>
          )}
        </DetailList>
        {next && (
          <Button size="lg" asChild>
            <Link href={next.href}>{next.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
