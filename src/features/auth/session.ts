import { redirect } from "next/navigation";
import { cache } from "react";

import type { Session } from "@/features/auth/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getSessionMock } from "@/mocks/auth";

/**
 * The signed-in user and business, or null when nobody is signed in.
 * Real auth replaces only this file (reading the session cookie and passing its token on).
 * Cached per request, so the layout and the page share one lookup.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  if (dataSource.auth === "mock") return getSessionMock();
  return apiClient<Session>("/auth/session");
});

/** For pages behind login: the session, or a redirect to sign in. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}
