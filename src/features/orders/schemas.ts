import { z } from "zod";

export const cancelOrderSchema = z.object({
  reason: z.enum(
    ["ordered_by_mistake", "duplicate", "bought_elsewhere", "not_needed", "too_slow", "other"],
    { error: "Choose why you're cancelling" },
  ),
  note: z.string().trim().max(300, "Keep the note to 300 characters or fewer"),
});

export type CancelOrderValues = z.infer<typeof cancelOrderSchema>;
