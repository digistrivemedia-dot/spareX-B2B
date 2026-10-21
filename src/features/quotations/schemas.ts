import { z } from "zod";

export const revisionSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(5, "Tell Kannali what to change, e.g. a target price or quantity")
    .max(500, "Keep it to 500 characters or fewer"),
});

export const rejectionSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(3, "Tell Kannali why, e.g. found the parts locally")
    .max(500, "Keep it to 500 characters or fewer"),
});

export type CommentValues = { comment: string };

export const requestQuotationSchema = z.object({
  notes: z.string().trim().max(500, "Keep notes to 500 characters or fewer"),
});

export type RequestQuotationValues = z.infer<typeof requestQuotationSchema>;
