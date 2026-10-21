import type { RegisterValues } from "@/features/auth/schemas";
import type { RegistrationApplication, SignInOutcome } from "@/features/auth/types";

/** Turns the flat wizard values into the application the API expects. */
export function toRegistrationApplication(values: RegisterValues): RegistrationApplication {
  return {
    business: {
      name: values.businessName,
      type: values.businessType,
      gstin: values.gstin || undefined,
      pan: values.pan || undefined,
      licenceNumber: values.licenceNumber || undefined,
      otherRegistration: values.otherRegistration || undefined,
    },
    contact: {
      name: values.contactName || undefined,
      email: values.email,
      phone: `+91${values.mobile}`,
    },
    address: {
      line1: values.addressLine1,
      line2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state,
      pin: values.pin,
    },
    photos: values.photos,
    documents: values.documents,
  };
}

/** The wizard's values for an application being corrected or made again. */
export function toRegisterValues(
  application: RegistrationApplication,
): Omit<RegisterValues, "acceptTerms"> {
  const { business, contact, address } = application;
  return {
    businessName: business.name,
    businessType: business.type,
    gstin: business.gstin ?? "",
    pan: business.pan ?? "",
    licenceNumber: business.licenceNumber ?? "",
    otherRegistration: business.otherRegistration ?? "",
    documents: application.documents,
    contactName: contact.name ?? "",
    email: contact.email,
    mobile: contact.phone.replace(/^\+91/, ""),
    addressLine1: address.line1,
    addressLine2: address.line2 ?? "",
    pin: address.pin,
    city: address.city,
    state: address.state,
    photos: application.photos,
  };
}

/** Where to go after signing in: application status, a new password, or the portal. */
export function getSignedInDestination(result: Extract<SignInOutcome, { status: "signed_in" }>) {
  if (result.approvalStatus !== "approved" && result.applicationRef) {
    return `/application?ref=${encodeURIComponent(result.applicationRef)}`;
  }
  // "/" sends each person to the home page for their role.
  return result.mustSetPassword ? "/set-password" : "/";
}
