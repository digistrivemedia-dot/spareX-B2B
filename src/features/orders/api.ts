import type {
  Order,
  OrderFilters,
  OrderSummary,
  PlacedOrder,
  PlaceOrderRequest,
} from "@/features/orders/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { getOrderMock, getOrdersMock, placeOrderMock } from "@/mocks/orders";

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
  if (dataSource.orders === "mock") return placeOrderMock(request);
  return apiClient<PlacedOrder>("/orders", { method: "POST", body: request });
}
