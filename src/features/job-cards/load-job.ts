import { notFound } from "next/navigation";

import type { Permission } from "@/features/auth/permissions";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { authorizeAction, requireSession } from "@/features/auth/session";
import type { Session } from "@/features/auth/types";
import { getJobCard } from "@/features/job-cards/api";
import type { JobCard } from "@/features/job-cards/types";
import { ApiError } from "@/lib/api-client";

/** The trip whose driver may also record it: the pick-up (check-in) or the drop (handover). */
type Trip = "pickup" | "drop";

/** Whether this person may act on the job: by role, or as the driver of its trip. */
function mayAct(session: Session, job: JobCard, permission: Permission, trip?: Trip) {
  const isDriver = trip !== undefined && job.pickupDrop?.[trip]?.driver.id === session.user.id;
  return can(session.roles, permission) || isDriver;
}

/** Whether the job is at a branch this person sees. */
function isInScope(session: Session, job: JobCard) {
  const branchId = scopeToBranch(session);
  return !branchId || job.branch.id === branchId;
}

/**
 * For job card pages: loads the job and checks the person may open the page (by role, or as the
 * driver of `trip`) and that it's at their branch. Anyone else gets "page not found".
 */
export async function loadJobForPage(
  id: string,
  permission: Permission,
  trip?: Trip,
): Promise<{ job: JobCard; session: Session }> {
  const session = await requireSession();
  if (session.business.type !== "garage") notFound();
  const job = await getJobCard(id);
  if (!job || !isInScope(session, job) || !mayAct(session, job, permission, trip)) notFound();
  return { job, session };
}

/** For job card Server Actions: the same checks as the pages, failing with a message instead. */
export async function authorizeJobAction(
  id: string,
  permission: Permission,
  trip?: Trip,
): Promise<void> {
  const session = await authorizeAction(undefined, ["garage"]);
  const job = await getJobCard(id);
  if (!job || !isInScope(session, job)) {
    throw new ApiError(404, { message: "We couldn't find that job card." });
  }
  if (!mayAct(session, job, permission, trip)) {
    throw new ApiError(403, {
      message: "Your role doesn't allow this. Ask your account owner if you need it.",
    });
  }
}

/** Staff open jobs and look up technicians only at their own branch; owners at any. */
export async function authorizeBranchAction(branchId: string, permission: Permission) {
  const session = await authorizeAction(permission, ["garage"]);
  const ownBranch = scopeToBranch(session);
  if (ownBranch && ownBranch !== branchId) {
    throw new ApiError(403, { message: "You can only work on your own branch's jobs." });
  }
}
