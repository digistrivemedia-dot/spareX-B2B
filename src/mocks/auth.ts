import type {
  ApplicationStatus,
  RegistrationApplication,
  RegistrationReceipt,
  Session,
  SetPasswordRequest,
  SignInRequest,
  SignInResult,
  TwoFactorRequest,
} from "@/features/auth/types";
import { ApiError } from "@/lib/api-client";
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

/** Who is acting, as the real API reads it from the session token. */
export function currentStaffMock() {
  return { id: demoSession.user.id, name: demoSession.user.name };
}

export async function getSessionMock(): Promise<Session | null> {
  await simulateLatency(100);
  return demoSession;
}

const WORKSHOP_PHOTOS = ["/images/garage/workshop-1.jpg", "/images/garage/workshop-3.jpg"];

/** Applications in every state, so the demo can show each one. Their emails sign in to them. */
const applications: ApplicationStatus[] = [
  {
    referenceNumber: "SXB-REG-260412",
    submittedAt: daysFromToday(-1, 16, 20),
    status: "pending",
    application: {
      business: {
        name: "Raghavendra Auto Spares",
        type: "retailer",
        gstin: "29ABCPR7731K1Z8",
        pan: "ABCPR7731K",
      },
      contact: { email: "review@sparex.example.com", phone: "+919845577120" },
      address: {
        line1: "No. 42, 1st Main, Rajajinagar",
        city: "Bengaluru",
        state: "Karnataka",
        pin: "560010",
      },
      photos: WORKSHOP_PHOTOS,
      documents: [],
    },
  },
  {
    referenceNumber: "SXB-REG-260398",
    submittedAt: daysFromToday(-4, 11, 5),
    status: "sent_back",
    reviewedAt: daysFromToday(-2, 15, 40),
    reviewNotes: [
      "The shop photo doesn't show your signboard. Please add a clear photo of the shop front.",
      "The PIN code doesn't match Marathahalli. Please check the address.",
    ],
    application: {
      business: { name: "Speed Point Bike Care", type: "garage" },
      contact: { name: "Anil Reddy", email: "sentback@sparex.example.com", phone: "+919900214455" },
      address: {
        line1: "Shop 7, Outer Ring Road",
        line2: "Marathahalli",
        city: "Bengaluru",
        state: "Karnataka",
        pin: "560102",
      },
      photos: ["/images/garage/tools.jpg"],
      documents: [],
    },
  },
  {
    referenceNumber: "SXB-REG-260377",
    submittedAt: daysFromToday(-9, 10, 30),
    status: "rejected",
    reviewedAt: daysFromToday(-7, 12, 10),
    rejectionReason:
      "We couldn't verify the business at this address. Apply again with a trade licence or a recent electricity bill in the business name.",
    application: {
      business: { name: "QuickFix Two Wheeler Hub", type: "garage" },
      contact: { email: "rejected@sparex.example.com", phone: "+919731166208" },
      address: {
        line1: "Near Bus Stand, Hosur Road",
        city: "Bengaluru",
        state: "Karnataka",
        pin: "560068",
      },
      photos: ["/images/garage/workshop-2.jpg"],
      documents: [],
    },
  },
];

/** A verified business whose user hasn't chosen a password yet. */
const FIRST_LOGIN_EMAIL = "new@sparex.example.com";

/**
 * Demo rules: any email with a password of 8+ characters signs in. The demo owner's email has
 * 2-step verification switched on; the application emails above open their application status,
 * and FIRST_LOGIN_EMAIL asks for a new password.
 */
export async function signInMock({ email }: SignInRequest): Promise<SignInResult> {
  await simulateLatency(600);
  const address = email.toLowerCase();
  const applicant = applications.find((a) => a.application.contact.email === address);
  if (applicant) {
    return {
      status: "signed_in",
      approvalStatus: applicant.status,
      mustSetPassword: false,
      applicationRef: applicant.referenceNumber,
    };
  }
  if (address !== owner.email) {
    return {
      status: "signed_in",
      approvalStatus: "approved",
      mustSetPassword: address === FIRST_LOGIN_EMAIL,
    };
  }

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

export async function setPasswordMock({ resetToken }: SetPasswordRequest): Promise<void> {
  await simulateLatency(700);
  if (resetToken === "expired") {
    throw new ApiError(410, { message: "This reset link has expired. Ask for a new one." });
  }
}

export async function registerBusinessMock(
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  await simulateLatency(900);
  const latest = Math.max(...applications.map((a) => Number(a.referenceNumber.slice(-4))));
  const receipt = {
    referenceNumber: `SXB-REG-26${String(latest + 1).padStart(4, "0")}`,
    submittedAt: new Date().toISOString(),
  };
  applications.unshift({ ...receipt, status: "pending", application });
  return receipt;
}

export async function getApplicationMock(ref: string): Promise<ApplicationStatus | null> {
  await simulateLatency();
  return applications.find((a) => a.referenceNumber === ref) ?? null;
}

/** A sent-back application goes back into review with the corrections. */
export async function resubmitApplicationMock(
  ref: string,
  application: RegistrationApplication,
): Promise<RegistrationReceipt> {
  await simulateLatency(900);
  const index = applications.findIndex((a) => a.referenceNumber === ref);
  if (index === -1 || applications[index].status !== "sent_back") {
    throw new ApiError(409, { message: "This application can't be changed now." });
  }
  const submittedAt = new Date().toISOString();
  applications[index] = { referenceNumber: ref, submittedAt, status: "pending", application };
  return { referenceNumber: ref, submittedAt };
}
