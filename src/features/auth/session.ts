import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";

import { can, type Permission } from "@/features/auth/permissions";
import type { Session } from "@/features/auth/types";
import type { BusinessType } from "@/features/company/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getSessionMock } from "@/mocks/auth";

/** The cookie holding the session token, set by the sign-in Server Actions. */
export const SESSION_COOKIE = "sparex-session";

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
