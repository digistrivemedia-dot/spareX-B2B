import type {
  CreditSummary,
  Invoice,
  PayInvoicesRequest,
  PayInvoicesResult,
  Statement,
  StatementFilters,
} from "@/features/credit/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import {
  getCreditSummaryMock,
  getStatementMock,
  getUnpaidInvoicesMock,
  payInvoicesMock,
} from "@/mocks/credit";

export async function getCreditSummary(): Promise<CreditSummary> {
  if (dataSource.credit === "mock") return getCreditSummaryMock();
  return apiClient<CreditSummary>("/credit/summary");
}

/** Credit invoices with something left to pay, soonest due first. */
export async function getUnpaidInvoices(): Promise<Invoice[]> {
  if (dataSource.credit === "mock") return getUnpaidInvoicesMock();
  return apiClient<Invoice[]>("/credit/invoices", { query: { status: "unpaid" } });
}

export async function getStatement(filters: StatementFilters = {}): Promise<Statement> {
  if (dataSource.credit === "mock") return getStatementMock(filters);
  return apiClient<Statement>("/credit/statement", { query: filters });
}

export async function payInvoices(request: PayInvoicesRequest): Promise<PayInvoicesResult> {
  if (dataSource.credit === "mock") return payInvoicesMock(request);
  return apiClient<PayInvoicesResult>("/credit/payments", { method: "POST", body: request });
}
