import { getUnitPrice } from "@/features/catalog/utils";
import type {
  Order,
  OrderFilters,
  OrderLine,
  OrderSummary,
  PlacedOrder,
  PlaceOrderRequest,
} from "@/features/orders/types";
import type { Paginated } from "@/lib/types";
import { toIndiaDate } from "@/lib/dates";
import { calculateOrderTotals } from "@/lib/pricing";
import { lineFor, products } from "@/mocks/catalog";
import { branches } from "@/mocks/company";
import { daysFromToday, findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

const WHITEFIELD = { id: "br-whitefield", name: "Whitefield" };
const HSR = { id: "br-hsr", name: "HSR Layout" };

/** An order line at the tier price the quantity earns, or at an agreed (quoted) price. */
export function orderLine(
  productId: string,
  quantity: number,
  agreedPriceInPaise?: number,
): OrderLine {
  return {
    ...lineFor(productId, quantity),
    unitPriceInPaise: agreedPriceInPaise ?? getUnitPrice(findById(products, productId), quantity),
  };
}

type OrderSeed = Omit<
  Order,
  | "itemCount"
  | "subtotalInPaise"
  | "savingsInPaise"
  | "gstInPaise"
  | "deliveryInPaise"
  | "totalInPaise"
>;

/** Works out the totals from the lines, so every amount in the demo adds up. */
function order(seed: OrderSeed): Order {
  return { ...seed, ...calculateOrderTotals(seed.items), itemCount: seed.items.length };
}

export const orders: Order[] = [
  order({
    id: "ord-0419",
    number: "ORD-2026-0419",
    placedAt: daysFromToday(0, 9, 40),
    expectedDeliveryDate: daysFromToday(1),
    branch: HSR,
    status: "confirmed",
    items: [
      orderLine("p-philips-hs1", 20),
      orderLine("p-minda-flasher", 20),
      orderLine("p-minda-horn", 10),
    ],
    payment: { method: "online", status: "paid", paidAt: daysFromToday(0, 9, 41) },
    notes: "Counter stock top-up.",
    timeline: [
      { status: "placed", at: daysFromToday(0, 9, 40) },
      { status: "confirmed", at: daysFromToday(0, 10, 5) },
    ],
  }),
  order({
    id: "ord-0417",
    number: "ORD-2026-0417",
    poNumber: "PO/SSW/2026/041",
    poDate: daysFromToday(-2, 9),
    placedAt: daysFromToday(-2, 11, 20),
    expectedDeliveryDate: daysFromToday(1),
    branch: WHITEFIELD,
    status: "processing",
    quotationId: "qt-0088",
    items: [
      orderLine("p-castrol-power1-15w50", 60, 34500),
      orderLine("p-rolon-kit-classic", 10, 164000),
      orderLine("p-re-pads-classic", 12, 52000),
      orderLine("p-re-oil-filter", 60, 10500),
      orderLine("p-shell-ultra-15w50", 12, 59500),
    ],
    payment: { method: "credit", status: "pending" },
    notes: "Converted from quotation QT-2026-0088. Royal Enfield service camp stock.",
    timeline: [
      { status: "placed", at: daysFromToday(-2, 11, 20) },
      { status: "confirmed", at: daysFromToday(-2, 12, 5) },
      { status: "processing", at: daysFromToday(-1, 10, 30) },
    ],
  }),
  order({
    id: "ord-0414",
    number: "ORD-2026-0414",
    poNumber: "PO/SSW/2026/040",
    poDate: daysFromToday(-3, 9),
    placedAt: daysFromToday(-3, 16, 45),
    expectedDeliveryDate: daysFromToday(0, 17),
    branch: HSR,
    status: "out_for_delivery",
    items: [
      orderLine("p-castrol-scooter-10w30", 36),
      orderLine("p-honda-belt-activa", 4),
      orderLine("p-tvs-jumbo-90-100-10", 8),
      orderLine("p-honda-air-filter-activa", 10),
    ],
    payment: { method: "credit", status: "due", dueDate: daysFromToday(28) },
    invoice: {
      id: "inv-1158",
      number: "KG/26-27/1158",
      pdfUrl: "/documents/invoices/KG-26-27-1158.pdf",
    },
    timeline: [
      { status: "placed", at: daysFromToday(-3, 16, 45) },
      { status: "confirmed", at: daysFromToday(-3, 17, 10) },
      { status: "processing", at: daysFromToday(-2, 9, 30) },
      { status: "packed", at: daysFromToday(-2, 14) },
      { status: "shipped", at: daysFromToday(-2, 18, 15) },
      { status: "out_for_delivery", at: daysFromToday(0, 9, 5) },
    ],
  }),
  order({
    id: "ord-0409",
    number: "ORD-2026-0409",
    poNumber: "PO/SSW/2026/039",
    poDate: daysFromToday(-13, 9),
    placedAt: daysFromToday(-13, 12, 10),
    expectedDeliveryDate: daysFromToday(-11),
    branch: WHITEFIELD,
    status: "delivered",
    items: [
      orderLine("p-motul-7100-10w50", 24),
      orderLine("p-ktm-oil-filter", 10),
      orderLine("p-rolon-kit-ktm200", 6),
      orderLine("p-ktm-pads-200", 4),
    ],
    payment: { method: "credit", status: "due", dueDate: daysFromToday(18) },
    invoice: {
      id: "inv-1112",
      number: "KG/26-27/1112",
      pdfUrl: "/documents/invoices/KG-26-27-1112.pdf",
    },
    timeline: [
      { status: "placed", at: daysFromToday(-13, 12, 10) },
      { status: "confirmed", at: daysFromToday(-13, 12, 40) },
      { status: "processing", at: daysFromToday(-13, 15) },
      { status: "packed", at: daysFromToday(-12, 10) },
      { status: "shipped", at: daysFromToday(-12, 13, 30) },
      { status: "out_for_delivery", at: daysFromToday(-11, 9, 15) },
      { status: "delivered", at: daysFromToday(-11, 14, 20) },
    ],
  }),
  order({
    id: "ord-0405",
    number: "ORD-2026-0405",
    poNumber: "PO/SSW/2026/038",
    poDate: daysFromToday(-17, 9),
    placedAt: daysFromToday(-17, 10, 30),
    branch: HSR,
    status: "cancelled",
    items: [orderLine("p-exide-xltz5", 4), orderLine("p-mrf-zapper-90-90-12", 4)],
    payment: { method: "credit", status: "cancelled" },
    notes: "Cancelled at customer's request: duplicate of a counter purchase.",
    timeline: [
      { status: "placed", at: daysFromToday(-17, 10, 30) },
      { status: "cancelled", at: daysFromToday(-17, 13, 15) },
    ],
  }),
  order({
    id: "ord-0398",
    number: "ORD-2026-0398",
    poNumber: "PO/SSW/2026/036",
    poDate: daysFromToday(-28, 9),
    placedAt: daysFromToday(-28, 15, 5),
    expectedDeliveryDate: daysFromToday(-26),
    branch: WHITEFIELD,
    status: "delivered",
    items: [
      orderLine("p-castrol-activ-20w40", 48),
      orderLine("p-bosch-spark-plug", 50),
      orderLine("p-rolon-shoe-honda", 20),
    ],
    payment: { method: "credit", status: "due", dueDate: daysFromToday(3) },
    invoice: {
      id: "inv-1069",
      number: "KG/26-27/1069",
      pdfUrl: "/documents/invoices/KG-26-27-1069.pdf",
    },
    timeline: [
      { status: "placed", at: daysFromToday(-28, 15, 5) },
      { status: "confirmed", at: daysFromToday(-28, 15, 40) },
      { status: "processing", at: daysFromToday(-27, 9, 30) },
      { status: "packed", at: daysFromToday(-27, 12) },
      { status: "shipped", at: daysFromToday(-27, 16, 45) },
      { status: "out_for_delivery", at: daysFromToday(-26, 9) },
      { status: "delivered", at: daysFromToday(-26, 12, 35) },
    ],
  }),
];

function toSummary({ items, timeline, ...summary }: Order): OrderSummary {
  return summary;
}

/** Upper case without spaces or punctuation, so "po ssw 2026 041" finds "PO/SSW/2026/041". */
const normalise = (text: string) => text.toUpperCase().replace(/[^A-Z0-9]/g, "");

export async function getOrdersMock({
  q,
  statuses,
  branchId,
  from,
  to,
  sort = "placedAt",
  order = "desc",
  page,
  pageSize,
}: OrderFilters): Promise<Paginated<OrderSummary>> {
  await simulateLatency();
  const matching = orders.filter((o) => {
    const placedOn = toIndiaDate(o.placedAt);
    const searchable = normalise(`${o.number} ${o.poNumber ?? ""}`);
    return (
      (!q || searchable.includes(normalise(q))) &&
      (!statuses || statuses.includes(o.status)) &&
      (!branchId || o.branch.id === branchId) &&
      (!from || placedOn >= from) &&
      (!to || placedOn <= to)
    );
  });
  return paginate(sortItems(matching, sort, order).map(toSummary), page, pageSize);
}

export async function getOrderMock(id: string): Promise<Order | null> {
  await simulateLatency();
  return orders.find((o) => o.id === id) ?? null;
}

type NewOrder = Pick<Order, "poNumber" | "poDate" | "notes" | "quotationId" | "payment"> & {
  branchId: string;
  items: OrderLine[];
};

/** Adds a new order the way the backend will. Kept in memory until the server restarts. */
export function createOrder({ branchId, ...details }: NewOrder): Order {
  const { id, name } = findById(branches, branchId);
  const latest = Math.max(...orders.map((o) => Number(o.number.slice(-4))));
  const serial = String(latest + 1).padStart(4, "0");
  const placedAt = new Date().toISOString();

  const created = order({
    ...details,
    id: `ord-${serial}`,
    number: `ORD-2026-${serial}`,
    placedAt,
    expectedDeliveryDate: daysFromToday(1, 18),
    branch: { id, name },
    status: "placed",
    timeline: [{ status: "placed", at: placedAt }],
  });
  orders.unshift(created);
  return created;
}

/** Prices come from the catalogue, never from the browser. */
export async function placeOrderMock(request: PlaceOrderRequest): Promise<PlacedOrder> {
  await simulateLatency(900);
  const { id, number } = createOrder({
    branchId: request.branchId,
    poNumber: request.poNumber,
    poDate: request.poDate,
    notes: request.notes,
    items: request.items.map(({ productId, quantity }) => orderLine(productId, quantity)),
    payment:
      request.payment.method === "credit"
        ? { method: "credit", status: "pending" }
        : {
            method: "online",
            status: "paid",
            channel: request.payment.channel,
            paidAt: new Date().toISOString(),
          },
  });
  return { id, number };
}
