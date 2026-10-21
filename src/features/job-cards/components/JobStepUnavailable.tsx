import { ClipboardList } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

type JobStepUnavailableProps = {
  jobId: string;
  title: string;
  description: string;
};

/** Shown when a job step's page is opened while the job is at another step. */
export function JobStepUnavailable({ jobId, title, description }: JobStepUnavailableProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <EmptyState
        icon={ClipboardList}
        title={title}
        description={description}
        action={
          <Button asChild>
            <Link href={`/garage/jobs/${jobId}`}>Open job card</Link>
          </Button>
        }
      />
    </div>
  );
}
