import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { DataTablePagination } from "@/components/ui/data-table/DataTablePagination";
import { FilterSelect } from "@/components/ui/FilterSelect";
import { can, scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBranches } from "@/features/company/api";
import { BranchFilter } from "@/features/garage/components/BranchFilter";
import { getReviews, getReviewSummary } from "@/features/reviews/api";
import { RatingSummary } from "@/features/reviews/components/RatingSummary";
import { ReviewList } from "@/features/reviews/components/ReviewList";
import { getParam, parsePage, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Reviews",
};

const RATINGS = ["5", "4", "3", "2", "1"];

type ReviewsPageProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const session = await requirePermission("reviews:view", ["garage"]);
  const params = await searchParams;
  const branchId = scopeToBranch(session, getParam(params, "branch"));
  const rating = Number(getParam(params, "rating")) || undefined;
  const [reviews, summary, branches] = await Promise.all([
    getReviews({ rating, branchId, page: parsePage(params) }),
    getReviewSummary(branchId),
    getBranches(),
  ]);
  const { items, ...pagination } = reviews;

  return (
    <>
      <PageHeader
        title="Reviews"
        description="What customers said after their service, from the SpareX app."
      />
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
          <RatingSummary summary={summary} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <FilterSelect
              param="rating"
              label="Stars"
              allLabel="All ratings"
              options={RATINGS.map((value) => ({ value, label: `${value} star` }))}
            />
            <BranchFilter
              branches={branches}
              canChoose={can(session.roles, "garage:all_branches")}
            />
          </div>
          <ReviewList reviews={items} />
          {pagination.total > pagination.pageSize && <DataTablePagination {...pagination} />}
        </div>
      </div>
    </>
  );
}
