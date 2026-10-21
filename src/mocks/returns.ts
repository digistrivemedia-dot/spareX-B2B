import type { Order } from "@/features/orders/types";
import type {
  CreateReturnRequest,
  ReturnFilters,
  ReturnLine,
  ReturnRequest,
  ReturnSummary,
} from "@/features/returns/types";
import { canReturn, PHOTO_REQUIRED_REASONS } from "@/features/returns/utils";
import { ApiError } from "@/lib/api-client";
import { summarisePricing } from "@/lib/pricing";
import type { Paginated } from "@/lib/types";
import { orders } from "@/mocks/orders";
import { daysFromToday, findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

/** The order's own line for a product, at the price that was paid. */
function returnLine(order: Order, productId: string, quantity: number): ReturnLine {
  const line = order.items.find((item) => item.productId === productId);
  if (!line) throw new ApiError(422, { message: "That part isn't on this order." });
  const { partNumber, name, unitPriceInPaise, gstRatePercent } = line;
  return { productId, partNumber, name, quantity, unitPriceInPaise, gstRatePercent };
}

type ReturnSeed = Omit<
  ReturnRequest,
  "order" | "branch" | "items" | "itemCount" | "refundInPaise" | "refundMethod"
> & {
  orderId: string;
  items: { productId: string; quantity: number }[];
};

/** Fills in the order details and works out the refund, GST included. */
function returnRequest({ orderId, items, ...seed }: ReturnSeed): ReturnRequest {
  const order = findById(orders, orderId);
  const lines = items.map(({ productId, quantity }) => returnLine(order, productId, quantity));
  const { subtotalInPaise, gstInPaise } = summarisePricing(
    lines.map((line) => ({ ...line, listPriceInPaise: line.unitPriceInPaise })),
  );
  return {
    ...seed,
    order: { id: order.id, number: order.number },
    branch: order.branch,
    items: lines,
    itemCount: lines.length,
    refundInPaise: subtotalInPaise + gstInPaise,
    refundMethod: order.payment.method === "credit" ? "credit_note" : "original_payment",
  };
}

export const returns: ReturnRequest[] = [
  returnRequest({
    id: "ret-0015",
    number: "RET-2026-0015",
    orderId: "ord-0398",
    status: "requested",
    requestedAt: daysFromToday(-1, 15, 40),
    reason: "does_not_fit",
    notes: "Ordered for Activa 6G but these are the older drum size. Unused, in the box.",
    photos: [],
    items: [{ productId: "p-rolon-shoe-honda", quantity: 4 }],
    timeline: [{ status: "requested", at: daysFromToday(-1, 15, 40) }],
  }),
  returnRequest({
    id: "ret-0012",
    number: "RET-2026-0012",
    orderId: "ord-0409",
    status: "refunded",
    requestedAt: daysFromToday(-10, 11, 5),
    reason: "wrong_part",
    notes: "Received RC 390 pads instead of Duke 200 pads.",
    photos: [],
    items: [{ productId: "p-ktm-pads-200", quantity: 2 }],
    timeline: [
      { status: "requested", at: daysFromToday(-10, 11, 5) },
      { status: "approved", at: daysFromToday(-10, 15, 30) },
      { status: "picked_up", at: daysFromToday(-9, 12) },
      { status: "refunded", at: daysFromToday(-8, 10, 20), note: "Credit note CN/26-27/0034" },
    ],
  }),
];

function toSummary({ items, timeline, photos, ...summary }: ReturnRequest): ReturnSummary {
  return summary;
}

export async function getReturnsMock({
  orderId,
  sort = "requestedAt",
  order = "desc",
  page,
  pageSize,
}: ReturnFilters): Promise<Paginated<ReturnSummary>> {
  await simulateLatency();
  const matching = returns.filter((r) => !orderId || r.order.id === orderId);
  return paginate(sortItems(matching, sort, order).map(toSummary), page, pageSize);
}

export async function getReturnMock(id: string): Promise<ReturnRequest | null> {
  await simulateLatency();
  return returns.find((r) => r.id === id) ?? null;
}

/** How many of each part on the order are already in a return that wasn't rejected. */
function getReturnedQuantities(orderId: string): Map<string, number> {
  const returned = new Map<string, number>();
  for (const r of returns) {
    if (r.order.id !== orderId || r.status === "rejected") continue;
    for (const line of r.items) {
      returned.set(line.productId, (returned.get(line.productId) ?? 0) + line.quantity);
    }
  }
  return returned;
}

export async function getReturnedQuantitiesMock(orderId: string): Promise<Record<string, number>> {
  await simulateLatency(100);
  return Object.fromEntries(getReturnedQuantities(orderId));
}

export async function createReturnMock(request: CreateReturnRequest): Promise<ReturnRequest> {
  await simulateLatency(900);
  const order = findById(orders, request.orderId);
  if (!canReturn(order)) {
    throw new ApiError(409, { message: "Only delivered orders can be returned." });
  }
  if (PHOTO_REQUIRED_REASONS.includes(request.reason) && request.photos.length === 0) {
    throw new ApiError(422, { message: "Add at least one photo so Kannali can check the part." });
  }
  const returned = getReturnedQuantities(order.id);
  for (const { productId, quantity } of request.items) {
    const ordered = order.items.find((item) => item.productId === productId)?.quantity ?? 0;
    if (quantity > ordered - (returned.get(productId) ?? 0)) {
      throw new ApiError(422, { message: "You're returning more than is left on the order." });
    }
  }

  const latest = Math.max(...returns.map((r) => Number(r.number.slice(-4))));
  const serial = String(latest + 1).padStart(4, "0");
  const now = new Date().toISOString();
  const created = returnRequest({
    id: `ret-${serial}`,
    number: `RET-2026-${serial}`,
    orderId: order.id,
    status: "requested",
    requestedAt: now,
    reason: request.reason,
    notes: request.notes,
    photos: request.photos,
    items: request.items,
    timeline: [{ status: "requested", at: now }],
  });
  returns.unshift(created);
  return created;
}
