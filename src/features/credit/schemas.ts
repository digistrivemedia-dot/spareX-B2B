import { z } from "zod";

export const payDuesSchema = z
  .object({
    invoiceIds: z.array(z.string()).min(1, "Choose at least one invoice to pay"),
    method: z.enum(["razorpay", "bank_transfer"]),
    channel: z.enum(["upi", "netbanking", "card"]),
    transferReference: z.string().trim().max(30, "Keep the reference to 30 characters or fewer"),
  })
  .superRefine((values, context) => {
    if (values.method === "bank_transfer" && values.transferReference.length < 6) {
      context.addIssue({
        code: "custom",
        path: ["transferReference"],
        message: "Enter the UTR or reference from your bank so Kannali can match the payment",
      });
    }
  });

export type PayDuesValues = z.infer<typeof payDuesSchema>;
