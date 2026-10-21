import { getSession } from "@/features/auth/session";
import type { StaffRef } from "@/features/job-cards/types";
import { ApiError } from "@/lib/api-client";

/**
 * Who is acting, as the real API reads it from the session token. Server-only: it reads the
 * session cookie, so only mock handlers called from the server may use it.
 */
export async function currentStaffMock(): Promise<StaffRef> {
  const session = await getSession();
  if (!session) throw new ApiError(401, { message: "Please sign in again." });
  return { id: session.user.id, name: session.user.name };
}
