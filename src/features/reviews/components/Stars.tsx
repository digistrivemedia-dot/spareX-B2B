import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const MAX_STARS = 5;

/** Filled and empty stars for a rating, read out as "4 out of 5 stars". */
export function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of ${MAX_STARS} stars`}
      className="inline-flex gap-0.5"
    >
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <Star
          key={index}
          aria-hidden
          className={cn(
            size === "lg" ? "size-5" : "size-4",
            index < Math.round(rating) ? "fill-orange-500 text-orange-500" : "text-gray-300",
          )}
        />
      ))}
    </span>
  );
}
