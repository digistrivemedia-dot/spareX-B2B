import type { Payment, PaymentFilters } from "@/features/payments/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { getPaymentMock, getPaymentsMock } from "@/mocks/payments";

export async function getPayments(filters: PaymentFilters = {}): Promise<Paginated<Payment>> {
  if (dataSource.payments === "mock") return getPaymentsMock(filters);
  return apiClient<Paginated<Payment>>("/payments", { query: filters });
}

/** One payment, or null if it doesn't exist. */
export async function getPayment(id: string): Promise<Payment | null> {
  if (dataSource.payments === "mock") return getPaymentMock(id);
  return apiClient<Payment | null>(`/payments/${id}`);
}
