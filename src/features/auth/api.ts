import type {
  RegistrationApplication,
  RegistrationReceipt,
  SignInRequest,
  SignInResult,
  TwoFactorRequest,
} from "@/features/auth/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import {
  registerBusinessMock,
  requestPasswordResetMock,
  resendTwoFactorCodeMock,
  signInMock,
  verifyTwoFactorMock,
} from "@/mocks/auth";

export async function signIn(request: SignInRequest): Promise<SignInResult> {
  if (dataSource.auth === "mock") return signInMock(request);
  return apiClient<SignInResult>("/auth/sign-in", { method: "POST", body: request });
}

export async function verifyTwoFactor(request: TwoFactorRequest): Promise<void> {
  if (dataSource.auth === "mock") return verifyTwoFactorMock(request);
  return apiClient<void>("/auth/two-factor/verify", { method: "POST", body: request });
}

export async function resendTwoFactorCode(challengeId: string): Promise<void> {
  if (dataSource.auth === "mock") return resendTwoFactorCodeMock();
  return apiClient<void>("/auth/two-factor/resend", { method: "POST", body: { challengeId } });
}

export async function requestPasswordReset(email: string): Promise<void> {
  if (dataSource.auth === "mock") return requestPasswordResetMock();
  return apiClient<void>("/auth/password-reset", { method: "POST", body: { email } });
}

export async function registerBusiness(
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  if (dataSource.auth === "mock") return registerBusinessMock(application);
  return apiClient<RegistrationReceipt>("/registrations", { method: "POST", body: application });
}
