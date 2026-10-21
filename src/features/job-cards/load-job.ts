import { notFound } from "next/navigation";

import type { Permission } from "@/features/auth/permissions";
import { scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import type { Session } from "@/features/auth/types";
import { getJobCard } from "@/features/job-cards/api";
import type { JobCard } from "@/features/job-cards/types";

/**
 * For job card pages: checks the permission, loads the job, and keeps staff to their own
 * branch's jobs (others get "page not found").
 */
export async function loadJobForPage(
  id: string,
  permission: Permission,
): Promise<{ job: JobCard; session: Session }> {
  const session = await requirePermission(permission, ["garage"]);
  const job = await getJobCard(id);
  const branchId = scopeToBranch(session);
  if (!job || (branchId && job.branch.id !== branchId)) notFound();
  return { job, session };
}
