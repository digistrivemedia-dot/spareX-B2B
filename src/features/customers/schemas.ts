import { z } from "zod";

import { isValidPlate } from "@/features/customers/utils";
import { emailField, mobileField, requiredText } from "@/lib/validation";

export const newCustomerSchema = z
  .object({
    name: requiredText("Enter the customer's name"),
    phone: mobileField,
    email: emailField.or(z.literal("")),
    plate: z.string().trim(),
    type: z.enum(["two_wheeler", "three_wheeler", "car", "commercial"]),
    make: z.string().trim(),
    model: z.string().trim(),
  })
  .superRefine((values, context) => {
    // A vehicle is optional, but once a plate is typed the rest is needed too.
    if (!values.plate) return;
    if (!isValidPlate(values.plate)) {
      context.addIssue({
        code: "custom",
        path: ["plate"],
        message: "Enter a plate like KA 01 AB 1234",
      });
    }
    if (!values.make)
      context.addIssue({ code: "custom", path: ["make"], message: "Enter the make" });
    if (!values.model)
      context.addIssue({ code: "custom", path: ["model"], message: "Enter the model" });
  });

export type NewCustomerValues = z.infer<typeof newCustomerSchema>;
