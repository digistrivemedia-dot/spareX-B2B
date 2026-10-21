import type {
  CheckInRequest,
  JobCard,
  JobCardFilters,
  JobCardSummary,
  WalkInRequest,
} from "@/features/job-cards/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { checkInMock, createWalkInMock, getJobCardMock, getJobCardsMock } from "@/mocks/job-cards";

export async function getJobCards(
  filters: JobCardFilters = {},
): Promise<Paginated<JobCardSummary>> {
  if (dataSource.jobCards === "mock") return getJobCardsMock(filters);
  const { statuses, ...params } = filters;
  return apiClient<Paginated<JobCardSummary>>("/garage/jobs", {
    query: { ...params, statuses: statuses?.join(",") },
  });
}

/** One job card with everything done on it so far, or null if there is none. */
export async function getJobCard(id: string): Promise<JobCard | null> {
  if (dataSource.jobCards === "mock") return getJobCardMock(id);
  return apiClient<JobCard | null>(`/garage/jobs/${id}`);
}

/** Opens a job for a vehicle that arrived without a booking. */
export async function createWalkIn(request: WalkInRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return createWalkInMock(request);
  return apiClient<JobCard>("/garage/jobs", { method: "POST", body: request });
}

/** Records the vehicle's condition on arrival; the job card is then open for work. */
export async function checkIn(id: string, request: CheckInRequest): Promise<JobCard> {
  if (dataSource.jobCards === "mock") return checkInMock(id, request);
  return apiClient<JobCard>(`/garage/jobs/${id}/check-in`, { method: "POST", body: request });
}
