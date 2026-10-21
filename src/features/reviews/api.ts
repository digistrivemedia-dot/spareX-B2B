import type { Review, ReviewFilters, ReviewSummary } from "@/features/reviews/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { getReviewsMock, getReviewSummaryMock } from "@/mocks/reviews";

export async function getReviews(filters: ReviewFilters = {}): Promise<Paginated<Review>> {
  if (dataSource.reviews === "mock") return getReviewsMock(filters);
  return apiClient<Paginated<Review>>("/garage/reviews", { query: filters });
}

/** The average rating and how many reviews gave each number of stars. */
export async function getReviewSummary(branchId?: string): Promise<ReviewSummary> {
  if (dataSource.reviews === "mock") return getReviewSummaryMock(branchId);
  return apiClient<ReviewSummary>("/garage/reviews/summary", { query: { branchId } });
}
