import type { RegisterValues } from "@/features/auth/schemas";
import type { RegistrationApplication } from "@/features/auth/types";

/** Turns the flat wizard values into the application the API expects. */
export function toRegistrationApplication(values: RegisterValues): RegistrationApplication {
  return {
    business: {
      name: values.businessName,
      type: values.businessType,
      gstin: values.gstin,
      pan: values.pan,
    },
    contact: { name: values.contactName, email: values.email, phone: `+91${values.mobile}` },
    address: {
      line1: values.addressLine1,
      line2: values.addressLine2 || undefined,
      city: values.city,
      state: values.state,
      pin: values.pin,
    },
  };
}
