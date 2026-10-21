import type {
  CreateReturnRequest,
  ReturnFilters,
  ReturnRequest,
  ReturnSummary,
} from "@/features/returns/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import {
  createReturnMock,
  getReturnedQuantitiesMock,
  getReturnMock,
  getReturnsMock,
} from "@/mocks/returns";

export async function getReturns(filters: ReturnFilters = {}): Promise<Paginated<ReturnSummary>> {
  if (dataSource.returns === "mock") return getReturnsMock(filters);
  return apiClient<Paginated<ReturnSummary>>("/returns", { query: filters });
}

/** One return with its parts, photos and history, or null if it doesn't exist. */
export async function getReturn(id: string): Promise<ReturnRequest | null> {
  if (dataSource.returns === "mock") return getReturnMock(id);
  return apiClient<ReturnRequest | null>(`/returns/${id}`);
}

/** Units of each part on the order that are already in a return (rejected returns don't count). */
export async function getReturnedQuantitiesForOrder(
  orderId: string,
): Promise<Record<string, number>> {
  if (dataSource.returns === "mock") return getReturnedQuantitiesMock(orderId);
  return apiClient<Record<string, number>>(`/orders/${orderId}/returned-quantities`);
}

export async function createReturn(request: CreateReturnRequest): Promise<ReturnRequest> {
  if (dataSource.returns === "mock") return createReturnMock(request);
  return apiClient<ReturnRequest>("/returns", { method: "POST", body: request });
}
