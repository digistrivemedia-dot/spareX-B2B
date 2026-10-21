import { z } from "zod";

import { MAX_RETURN_PHOTOS, PHOTO_REQUIRED_REASONS } from "@/features/returns/utils";

export const returnSchema = z
  .object({
    /** Units to return per product id; 0 means the part isn't being returned. */
    quantities: z.record(z.string(), z.number().int().min(0)),
    reason: z.enum(
      ["damaged_in_transit", "wrong_part", "does_not_fit", "defective", "not_needed"],
      {
        error: "Choose why you're returning the parts",
      },
    ),
    notes: z.string().trim().max(500, "Keep notes to 500 characters or fewer"),
    photos: z.array(z.string()).max(MAX_RETURN_PHOTOS, `Add up to ${MAX_RETURN_PHOTOS} photos`),
  })
  .superRefine((values, context) => {
    if (!Object.values(values.quantities).some((quantity) => quantity > 0)) {
      context.addIssue({
        code: "custom",
        path: ["quantities"],
        message: "Choose at least one part to return",
      });
    }
    if (PHOTO_REQUIRED_REASONS.includes(values.reason) && values.photos.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["photos"],
        message: "Add a photo of the damage or fault so Kannali can approve the return",
      });
    }
  });

export type ReturnValues = z.infer<typeof returnSchema>;
