import type { Session } from "@/features/auth/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { getSessionMock } from "@/mocks/auth";

/**
 * The signed-in user and business, or null when nobody is signed in.
 * Real auth replaces only this file (reading the session cookie and passing its token on).
 */
export async function getSession(): Promise<Session | null> {
  if (dataSource.auth === "mock") return getSessionMock();
  return apiClient<Session>("/auth/session");
}
