import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { can, type Permission } from "@/features/auth/permissions";
import type { Session } from "@/features/auth/types";
import type { BusinessType } from "@/features/company/types";
import { ApiError, apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/constants";
import { getSessionMock } from "@/mocks/auth";

/**
 * The signed-in user and business, or null when nobody is signed in.
 * Real auth replaces only this file. Cached per request, so the layout and the page share one lookup.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (dataSource.auth === "mock") return getSessionMock(token);
  if (!token) return null;
  return apiClient<Session>("/auth/session", { token });
});

/** For pages behind login: the session, or a redirect to sign in. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

/**
 * For pages only some roles or business types may open. Anyone else gets "page not found",
 * the same as for a link that doesn't exist, so nothing is revealed.
 */
export async function requirePermission(
  permission: Permission,
  businessTypes?: BusinessType[],
): Promise<Session> {
  const session = await requireSession();
  const isAllowedType = !businessTypes || businessTypes.includes(session.business.type);
  if (!isAllowedType || !can(session.roles, permission)) notFound();
  return session;
}

/**
 * For Server Actions, which can be called without opening their page: the caller's session, or
 * an error that the action returns as its message. Pages check access too; this is the guard
 * that counts.
 */
export async function authorizeAction(
  permission?: Permission,
  businessTypes?: BusinessType[],
): Promise<Session> {
  const session = await getSession();
  if (!session) {
    throw new ApiError(401, { message: "Your session has ended. Please sign in again." });
  }
  const isAllowedType = !businessTypes || businessTypes.includes(session.business.type);
  if (!isAllowedType || (permission && !can(session.roles, permission))) {
    throw new ApiError(403, {
      message: "Your role doesn't allow this. Ask your account owner if you need it.",
    });
  }
  return session;
}
