import type { PlacedOrder } from "@/features/orders/types";
import type {
  AcceptQuotationRequest,
  Quotation,
  QuotationFilters,
  QuotationRequest,
  QuotationSummary,
} from "@/features/quotations/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import {
  acceptQuotationMock,
  getQuotationMock,
  getQuotationsMock,
  rejectQuotationMock,
  requestQuotationMock,
  requestRevisionMock,
} from "@/mocks/quotations";

export async function getQuotations(
  filters: QuotationFilters = {},
): Promise<Paginated<QuotationSummary>> {
  if (dataSource.quotations === "mock") return getQuotationsMock(filters);
  return apiClient<Paginated<QuotationSummary>>("/quotations", { query: filters });
}

/** One quotation with its lines and history, or null if it doesn't exist. */
export async function getQuotation(id: string): Promise<Quotation | null> {
  if (dataSource.quotations === "mock") return getQuotationMock(id);
  return apiClient<Quotation | null>(`/quotations/${id}`);
}

export async function requestQuotation(request: QuotationRequest): Promise<Quotation> {
  if (dataSource.quotations === "mock") return requestQuotationMock(request);
  return apiClient<Quotation>("/quotations", { method: "POST", body: request });
}

export async function acceptQuotation(
  id: string,
  request: AcceptQuotationRequest,
): Promise<PlacedOrder> {
  if (dataSource.quotations === "mock") return acceptQuotationMock(id, request);
  return apiClient<PlacedOrder>(`/quotations/${id}/accept`, { method: "POST", body: request });
}

export async function requestRevision(id: string, comment: string): Promise<Quotation> {
  if (dataSource.quotations === "mock") return requestRevisionMock(id, comment);
  return apiClient<Quotation>(`/quotations/${id}/revision`, { method: "POST", body: { comment } });
}

export async function rejectQuotation(id: string, reason?: string): Promise<Quotation> {
  if (dataSource.quotations === "mock") return rejectQuotationMock(id, reason);
  return apiClient<Quotation>(`/quotations/${id}/reject`, { method: "POST", body: { reason } });
}
