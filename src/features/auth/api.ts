import type {
  ApplicationStatus,
  RegistrationApplication,
  RegistrationReceipt,
  SetPasswordRequest,
  SignInRequest,
  SignInResult,
  TwoFactorRequest,
  TwoFactorResult,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import {
  getApplicationMock,
  registerBusinessMock,
  requestPasswordResetMock,
  resendTwoFactorCodeMock,
  resubmitApplicationMock,
  setPasswordMock,
  signInMock,
  verifyTwoFactorMock,
} from "@/mocks/auth";

export async function signIn(request: SignInRequest): Promise<SignInResult> {
  if (dataSource.auth === "mock") return signInMock(request);
  return apiClient<SignInResult>("/auth/sign-in", { method: "POST", body: request });
}

export async function verifyTwoFactor(request: TwoFactorRequest): Promise<TwoFactorResult> {
  if (dataSource.auth === "mock") return verifyTwoFactorMock(request);
  return apiClient<TwoFactorResult>("/auth/two-factor/verify", { method: "POST", body: request });
}

export async function resendTwoFactorCode(challengeId: string): Promise<void> {
  if (dataSource.auth === "mock") return resendTwoFactorCodeMock();
  return apiClient<void>("/auth/two-factor/resend", { method: "POST", body: { challengeId } });
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (dataSource.auth === "mock") return requestPasswordResetMock();
  return apiClient<void>("/auth/password-reset", { method: "POST", body: { email } });
}

/** Sets a new password: from a reset link (with its token), or on first login. */
export async function setPassword(request: SetPasswordRequest): Promise<void> {
  if (dataSource.auth === "mock") return setPasswordMock(request);
  return apiClient<void>("/auth/password", { method: "POST", body: request });
}

export async function registerBusiness(
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  if (dataSource.auth === "mock") return registerBusinessMock(application);
  return apiClient<RegistrationReceipt>("/registrations", { method: "POST", body: application });
}

/** An application by its reference number, or null if there is none. */
export async function getApplication(ref: string): Promise<ApplicationStatus | null> {
  if (dataSource.auth === "mock") return getApplicationMock(ref);
  return apiClient<ApplicationStatus | null>(`/registrations/${ref}`);
}

/** Sends a sent-back application in again with the corrections. */
export async function resubmitApplication(
  ref: string,
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  if (dataSource.auth === "mock") return resubmitApplicationMock(ref, application);
  return apiClient<RegistrationReceipt>(`/registrations/${ref}`, {
    method: "PUT",
    body: application,
  });
}
