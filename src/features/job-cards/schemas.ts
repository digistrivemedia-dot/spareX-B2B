import { z } from "zod";

import { isValidPlate } from "@/features/customers/utils";
import { mobileField, requiredText } from "@/lib/validation";

const complaints = z
  .array(z.object({ text: z.string().trim().max(200, "Keep each one to 200 characters") }))
  .refine(
    (items) => items.some((item) => item.text.length > 0),
    "Add at least one thing the customer wants looked at",
  );

export const walkInSchema = z
  .object({
    branchId: requiredText("Choose the branch"),
    plate: z.string().trim().refine(isValidPlate, "Enter a number plate like KA 01 AB 1234"),
    /** Set once a plate on file is found. */
    vehicleId: z.string(),
    type: z.enum(["two_wheeler", "three_wheeler", "car", "commercial"]),
    make: z.string().trim(),
    model: z.string().trim(),
    customerName: z.string().trim(),
    customerPhone: z.string().trim(),
    complaints,
  })
  .superRefine((values, context) => {
    if (values.vehicleId) return;
    // A new plate needs the vehicle and its owner.
    const required = [
      ["make", "Enter the make, e.g. Honda"],
      ["model", "Enter the model, e.g. Activa 6G"],
      ["customerName", "Enter the customer's name"],
    ] as const;
    for (const [field, message] of required) {
      if (!values[field]) context.addIssue({ code: "custom", path: [field], message });
    }
    const phone = mobileField.safeParse(values.customerPhone);
    if (!phone.success) {
      context.addIssue({
        code: "custom",
        path: ["customerPhone"],
        message: phone.error.issues[0]?.message ?? "Enter a valid mobile number",
      });
    }
  });

export type WalkInValues = z.infer<typeof walkInSchema>;

export const checkInSchema = z.object({
  odometerKm: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, "Enter the odometer reading in km"),
  fuelLevel: z.enum(["empty", "quarter", "half", "three_quarters", "full"]),
  complaints,
  damages: z.array(
    z.object({
      id: z.string(),
      area: requiredText("Say where, e.g. Left side panel"),
      note: requiredText("Describe the damage"),
      photos: z.array(z.string()),
    }),
  ),
  photos: z.array(z.string()).max(8, "Add up to 8 photos"),
});

export type CheckInValues = z.infer<typeof checkInSchema>;
