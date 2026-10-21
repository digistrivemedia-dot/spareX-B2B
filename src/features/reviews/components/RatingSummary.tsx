import { SectionCard } from "@/components/ui/SectionCard";
import { UsageBar } from "@/components/ui/UsageBar";
import { Stars } from "@/features/reviews/components/Stars";
import type { ReviewSummary } from "@/features/reviews/types";
import { formatCount } from "@/lib/format";

/** The average rating and how the reviews split across 5 to 1 stars. */
export function RatingSummary({ summary }: { summary: ReviewSummary }) {
  return (
    <SectionCard title="Rating">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl font-semibold text-gray-900 tabular-nums">
            {summary.average.toFixed(1)}
          </span>
          <span className="flex flex-col gap-1">
            <Stars rating={summary.average} size="lg" />
            <span className="text-sm text-gray-500">{formatCount(summary.count, "review")}</span>
          </span>
        </div>
        <ul className="flex flex-col gap-2 text-sm">
          {summary.byRating.map(({ rating, count }) => (
            <li key={rating} className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3">
              {/* Fixed label and count columns keep the bars lined up. */}
              <span className="text-gray-700">{rating} star</span>
              <UsageBar used={count} limit={summary.count} label={`${rating}-star reviews`} />
              <span className="text-right text-gray-700 tabular-nums">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionCard>
  );
}
