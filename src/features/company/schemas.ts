import { z } from "zod";

import { emailField, mobileField, pinCodeField, requiredText } from "@/lib/validation";

export const branchSchema = z.object({
  name: requiredText("Give the branch a short name, e.g. Whitefield"),
  line1: requiredText("Enter the building and street"),
  line2: z.string().trim(),
  pin: pinCodeField,
  city: requiredText("Enter the city"),
  state: requiredText("Enter the state"),
  contactName: requiredText("Enter who receives deliveries here"),
  contactPhone: mobileField,
});

export type BranchValues = z.infer<typeof branchSchema>;

export const businessContactSchema = z.object({
  email: emailField,
  phone: mobileField,
});

export type BusinessContactValues = z.infer<typeof businessContactSchema>;

export const companyUserSchema = z.object({
  name: requiredText("Enter the person's name"),
  email: emailField,
  phone: mobileField,
  roles: z
    .array(z.enum(["owner", "manager", "technician", "spares", "billing"]))
    .min(1, "Choose at least one role"),
  branchId: requiredText("Choose the branch this person works at"),
});

export type CompanyUserValues = z.infer<typeof companyUserSchema>;
