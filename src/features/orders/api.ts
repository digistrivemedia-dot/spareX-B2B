import type {
  CancelOrderRequest,
  Order,
  OrderFilters,
  OrderSummary,
  PlacedOrder,
  PlaceOrderRequest,
} from "@/features/orders/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { cancelOrderMock, getOrderMock, getOrdersMock, placeOrderMock } from "@/mocks/orders";
import { placeQuotationOrderMock } from "@/mocks/quotations";

export async function getOrders(filters: OrderFilters = {}): Promise<Paginated<OrderSummary>> {
  if (dataSource.orders === "mock") return getOrdersMock(filters);
  const { statuses, ...params } = filters;
  return apiClient<Paginated<OrderSummary>>("/orders", {
    query: { ...params, statuses: statuses?.join(",") },
  });
}

/** One order with its lines and timeline, or null if it doesn't exist. */
export async function getOrder(id: string): Promise<Order | null> {
  if (dataSource.orders === "mock") return getOrderMock(id);
  return apiClient<Order | null>(`/orders/${id}`);
}

export async function placeOrder(request: PlaceOrderRequest): Promise<PlacedOrder> {
  if (dataSource.orders === "mock") {
    return request.quotationId ? placeQuotationOrderMock(request) : placeOrderMock(request);
  }
  return apiClient<PlacedOrder>("/orders", { method: "POST", body: request });
}

/** Only orders that haven't shipped can be cancelled. */
export async function cancelOrder(id: string, request: CancelOrderRequest): Promise<Order> {
  if (dataSource.orders === "mock") return cancelOrderMock(id, request);
  return apiClient<Order>(`/orders/${id}/cancel`, { method: "POST", body: request });
}
