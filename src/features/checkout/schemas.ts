import { z } from "zod";

/** Today's date as "YYYY-MM-DD", the format of a date input. */
const today = () => new Date().toISOString().slice(0, 10);

export const checkoutSchema = z.object({
  poNumber: z.string().trim().max(30, "Keep the PO number to 30 characters or fewer"),
  poDate: z
    .string()
    .refine((date) => !date || date <= today(), "The PO date can't be in the future"),
  notes: z.string().trim().max(500, "Keep notes for the warehouse to 500 characters or fewer"),
  paymentMethod: z.enum(["razorpay", "bank_transfer", "cod", "credit"], {
    error: "Choose how you'd like to pay",
  }),
  razorpayChannel: z.enum(["upi", "netbanking", "card"]),
  transferReference: z
    .string()
    .trim()
    .max(30, "Keep the transfer reference to 30 characters or fewer"),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
