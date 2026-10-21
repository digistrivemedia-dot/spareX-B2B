"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  registerBusiness,
  resubmitApplication,
  signIn,
  verifyTwoFactor,
} from "@/features/auth/api";
import { SESSION_COOKIE } from "@/features/auth/session";
import type {
  RegistrationApplication,
  RegistrationReceipt,
  SignInOutcome,
  SignInRequest,
  TwoFactorRequest,
} from "@/features/auth/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/**
 * Applications are sent from the server, so the application status page (rendered on the
 * server) sees them straight away.
 */
export async function registerBusinessAction(
  application: RegistrationApplication,
): Promise<ActionResult<RegistrationReceipt>> {
  return toActionResult(() => registerBusiness(application));
}

export async function resubmitApplicationAction(
  ref: string,
  application: RegistrationApplication,
): Promise<ActionResult<RegistrationReceipt>> {
  return toActionResult(async () => {
    const receipt = await resubmitApplication(ref, application);
    revalidatePath("/application");
    return receipt;
  });
}

// The session token stays in an httpOnly cookie, out of reach of the page's JavaScript.
async function startSession(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

/** Signs in on the server and keeps the session token in a cookie; the token never reaches the page. */
export async function signInAction(request: SignInRequest): Promise<ActionResult<SignInOutcome>> {
  return toActionResult(async () => {
    const result = await signIn(request);
    if (result.status !== "signed_in") return result;
    const { sessionToken, ...rest } = result;
    if (sessionToken) await startSession(sessionToken);
    return rest;
  });
}

export async function verifyTwoFactorAction(
  request: TwoFactorRequest,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    const { sessionToken } = await verifyTwoFactor(request);
    await startSession(sessionToken);
    return null;
  });
}

export async function signOutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
