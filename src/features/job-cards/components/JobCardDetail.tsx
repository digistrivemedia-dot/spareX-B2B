import { SectionCard } from "@/components/ui/SectionCard";
import { Timeline } from "@/components/ui/Timeline";
import { BillingSection } from "@/features/job-cards/components/detail/BillingSection";
import {
  CheckInSection,
  InspectionSection,
  VehicleCustomerSection,
} from "@/features/job-cards/components/detail/JobSections";
import { JobProgress } from "@/features/job-cards/components/detail/JobProgress";
import { PickupDropSection } from "@/features/job-cards/components/detail/PickupDropSection";
import { JobStatusCard } from "@/features/job-cards/components/detail/JobStatusCard";
import {
  EstimateSection,
  PartsSection,
  QualitySection,
  WorkSection,
} from "@/features/job-cards/components/detail/WorkSections";
import { can } from "@/features/auth/permissions";
import type { Role } from "@/features/auth/types";
import type { JobCard } from "@/features/job-cards/types";
import { getFinishedStages, getJobSteps } from "@/features/job-cards/utils";

/** Everything about one job, in the order the work happens; `roles` decides which actions show. */
export function JobCardDetail({ job, roles }: { job: JobCard; roles: Role[] }) {
  const finished = getFinishedStages(job);
  return (
    <div className="flex flex-col gap-6">
      <JobProgress job={job} />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <VehicleCustomerSection job={job} canViewCustomer={can(roles, "customers:view")} />
          {job.pickupDrop && (
            <PickupDropSection
              pickupDrop={job.pickupDrop}
              isDone={Boolean(job.pickupDrop.drop?.doneAt)}
            />
          )}
          <CheckInSection job={job} isDone={finished.has("check_in")} />
          <InspectionSection job={job} isDone={finished.has("inspection")} />
          <EstimateSection job={job} isDone={finished.has("approval")} />
          <div className="grid gap-6 lg:grid-cols-2">
            <WorkSection job={job} isDone={finished.has("service")} />
            <PartsSection job={job} />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <QualitySection job={job} isDone={finished.has("quality_check")} />
            <BillingSection
              job={job}
              canBill={can(roles, "jobs:billing")}
              isDone={finished.has("handover")}
            />
          </div>
        </div>

        {/* Below xl the aside dissolves so the status card leads the page and the timeline closes it. */}
        <aside className="contents xl:sticky xl:top-20 xl:flex xl:w-80 xl:shrink-0 xl:flex-col xl:gap-6">
          <div className="order-first xl:order-none">
            <JobStatusCard job={job} roles={roles} />
          </div>
          <SectionCard title="History" className="order-last xl:order-none">
            <Timeline label="Job history" steps={getJobSteps(job)} />
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}
