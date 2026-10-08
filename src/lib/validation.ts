import { z } from "zod";

import { GSTIN_PATTERN, isValidGstin } from "@/lib/gst";

/** Zod fields shared by every form that asks for the same thing, with the same messages. */

export const emailField = z.email("Enter a valid email address, e.g. name@yourbusiness.com");

/** 10 digits without +91; forms show the +91 prefix beside the input. */
export const mobileField = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a 10-digit mobile number starting with 6, 7, 8 or 9");

export const pinCodeField = z
  .string()
  .trim()
  .regex(/^[1-9]\d{5}$/, "Enter a 6-digit PIN code");

export const gstinField = z
  .string()
  .trim()
  .regex(GSTIN_PATTERN, "Enter your 15-character GSTIN, e.g. 29AAKFS4821M1Z3")
  .refine(isValidGstin, "The first two digits of this GSTIN aren't a valid state code");

export const panField = z
  .string()
  .regex(/^[A-Z]{5}\d{4}[A-Z]$/, "Enter a valid GSTIN above and we'll fill in your PAN");

export function requiredText(message: string) {
  return z.string().trim().min(1, message);
}
