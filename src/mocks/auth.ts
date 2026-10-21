import type {
  RegistrationApplication,
  RegistrationReceipt,
  Session,
  SignInRequest,
  SignInResult,
  TwoFactorRequest,
} from "@/features/auth/types";
import { formatPhone } from "@/lib/format";
import { business, companyUsers } from "@/mocks/company";
import { daysFromToday, findById, simulateLatency } from "@/mocks/utils";

const owner = findById(companyUsers, "usr-mahesh");

const demoSession: Session = {
  user: { id: owner.id, name: owner.name, email: owner.email, phone: owner.phone },
  business,
  roles: owner.roles,
  branchId: owner.branchId,
  approvalStatus: "approved",
};

export async function getSessionMock(): Promise<Session | null> {
  await simulateLatency(100);
  return demoSession;
}

/**
 * Demo rules: any email with a password of 8+ characters signs in. The demo owner's email has
 * 2-step verification switched on, so the code step can be shown; any 6-digit code passes.
 */
export async function signInMock({ email }: SignInRequest): Promise<SignInResult> {
  await simulateLatency(600);
  if (email.toLowerCase() !== owner.email) return { status: "signed_in" };

  const phone = formatPhone(owner.phone);
  return {
    status: "two_factor_required",
    challengeId: "2fa-demo",
    maskedPhone: `${phone.slice(0, -5)}••${phone.slice(-3)}`,
  };
}

export async function verifyTwoFactorMock({ code }: TwoFactorRequest): Promise<void> {
  await simulateLatency(500);
  if (!/^\d{6}$/.test(code)) throw new Error("The code must be 6 digits");
}

export async function resendTwoFactorCodeMock(): Promise<void> {
  await simulateLatency(400);
}

export async function requestPasswordResetMock(): Promise<void> {
  await simulateLatency(600);
}

export async function registerBusinessMock(
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  await simulateLatency(900);
  // Derived from the GSTIN so the same application always gets the same reference.
  const serial = application.business.gstin.slice(7, 11);
  return { referenceNumber: `SXB-REG-26${serial}`, submittedAt: daysFromToday(0, 12) };
}
