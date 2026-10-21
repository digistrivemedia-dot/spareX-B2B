import type { Review, ReviewFilters, ReviewSummary } from "@/features/reviews/types";
import type { Paginated } from "@/lib/types";
import { jobCards } from "@/mocks/job-cards";
import { daysFromToday, findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

/** [job id, stars, comment?, days after the job] */
type ReviewSeed = [string, number, string | undefined, number];

const SEEDS: ReviewSeed[] = [
  ["job-0136", 5, "Brakes feel brand new. Imran explained everything before starting.", -3],
  ["job-0133", 4, "Good service, a bit of a wait at the counter.", -6],
  ["job-0129", 5, "Replaced the battery in 20 minutes. Fair price.", -9],
  ["job-0126", 3, "Chain is quiet now but the bike was ready an hour late.", -13],
  ["job-0123", 5, undefined, -19],
  ["job-0122", 4, "Honest garage. They showed me the old parts.", -26],
  ["job-0121", 5, "Chain kit fitted perfectly, test ride before handover.", -38],
  ["job-0108", 2, "Service was fine but nobody called when it was ready.", -60],
];

const reviews: Review[] = SEEDS.map(([jobId, rating, comment, day], index) => {
  const job = findById(jobCards, jobId);
  return {
    id: `rev-${index + 1}`,
    rating,
    comment,
    customerName: job.customer.name,
    job: { id: job.id, number: job.number },
    branch: job.branch,
    createdAt: daysFromToday(day, 20),
  };
});

const matching = ({ rating, branchId }: ReviewFilters) =>
  reviews.filter(
    (review) =>
      (!rating || review.rating === rating) && (!branchId || review.branch.id === branchId),
  );

export async function getReviewsMock(filters: ReviewFilters): Promise<Paginated<Review>> {
  await simulateLatency();
  const { sort = "createdAt", order = "desc", page, pageSize } = filters;
  return paginate(sortItems(matching(filters), sort, order), page, pageSize);
}

/** Average and breakdown for a branch (or every branch), whatever the star filter. */
export async function getReviewSummaryMock(branchId?: string): Promise<ReviewSummary> {
  await simulateLatency(150);
  const scoped = matching({ branchId });
  const total = scoped.reduce((sum, review) => sum + review.rating, 0);
  return {
    average: scoped.length ? Math.round((total / scoped.length) * 10) / 10 : 0,
    count: scoped.length,
    byRating: [5, 4, 3, 2, 1].map((stars) => ({
      rating: stars,
      count: scoped.filter((review) => review.rating === stars).length,
    })),
  };
}
