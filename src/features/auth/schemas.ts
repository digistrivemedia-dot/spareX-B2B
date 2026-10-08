import { z } from "zod";

import { BUSINESS_TYPES } from "@/features/company/business-types";
import {
  emailField,
  gstinField,
  mobileField,
  panField,
  pinCodeField,
  requiredText,
} from "@/lib/validation";

export const signInSchema = z.object({
  email: emailField,
  password: z.string().min(8, "Your password has at least 8 characters"),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const twoFactorSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code from your SMS"),
});

export type TwoFactorValues = z.infer<typeof twoFactorSchema>;

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const registerSchema = z.object({
  // Step 1: business
  businessName: requiredText("Enter your business name as it appears on your GST certificate"),
  businessType: z.enum(BUSINESS_TYPES, { error: "Choose what kind of business you run" }),
  gstin: gstinField,
  pan: panField,
  // Step 2: contact
  contactName: requiredText("Enter the name of the person we should contact"),
  email: emailField,
  mobile: mobileField,
  addressLine1: requiredText("Enter the building and street"),
  addressLine2: z.string().trim(),
  pin: pinCodeField,
  city: requiredText("Enter your city"),
  state: requiredText("Enter your state"),
  // Step 3: review
  acceptTerms: z.boolean().refine(Boolean, "Please accept the terms to submit your application"),
});

export type RegisterValues = z.infer<typeof registerSchema>;

/** The wizard steps and the fields each one checks before moving on. */
export const REGISTER_STEPS = [
  {
    label: "Business",
    title: "Business details",
    fields: ["businessName", "businessType", "gstin", "pan"],
  },
  {
    label: "Contact",
    title: "Contact and address",
    fields: [
      "contactName",
      "email",
      "mobile",
      "addressLine1",
      "addressLine2",
      "pin",
      "city",
      "state",
    ],
  },
  { label: "Review", title: "Review and submit", fields: ["acceptTerms"] },
] as const satisfies readonly {
  label: string;
  title: string;
  fields: readonly (keyof RegisterValues)[];
}[];
