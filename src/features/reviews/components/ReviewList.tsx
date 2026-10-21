import { MessageSquareText } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { Stars } from "@/features/reviews/components/Stars";
import type { Review } from "@/features/reviews/types";
import { formatDate } from "@/lib/format";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <EmptyState
          icon={MessageSquareText}
          title="No reviews match"
          description="Try another star rating or branch."
        />
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4 text-sm shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Stars rating={review.rating} />
            <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
          <p className={review.comment ? "text-gray-900" : "text-gray-500"}>
            {review.comment ?? "No comment, just a rating."}
          </p>
          <p className="text-xs text-gray-500">
            {review.customerName} · {review.branch.name} ·{" "}
            <Link
              href={`/garage/jobs/${review.job.id}`}
              className="font-medium text-navy-700 hover:underline"
            >
              {review.job.number}
            </Link>
          </p>
        </li>
      ))}
    </ul>
  );
}
