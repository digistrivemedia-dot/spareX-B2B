import type { PlacedOrder, PlaceOrderRequest } from "@/features/orders/types";
import type {
  Quotation,
  QuotationFilters,
  QuotationLine,
  QuotationRequest,
  QuotationSummary,
} from "@/features/quotations/types";
import { QUOTATION_VALIDITY_DAYS } from "@/features/quotations/utils";
import { ApiError } from "@/lib/api-client";
import type { Paginated } from "@/lib/types";
import { summarisePricing } from "@/lib/pricing";
import { lineFor } from "@/mocks/catalog";
import { branches } from "@/mocks/company";
import { getCreditSummaryMock } from "@/mocks/credit";
import { createOrder, orderLine, toOrderPayment } from "@/mocks/orders";
import { daysFromToday, findById, paginate, simulateLatency, sortItems } from "@/mocks/utils";

const WHITEFIELD = { id: "br-whitefield", name: "Whitefield" };
const HSR = { id: "br-hsr", name: "HSR Layout" };

/** A quotation line priced automatically at the business price, unless Kannali quoted lower. */
function quotationLine(
  productId: string,
  quantity: number,
  quotedPriceInPaise?: number,
): QuotationLine {
  const line = lineFor(productId, quantity);
  return { ...line, quotedPriceInPaise: quotedPriceInPaise ?? line.listPriceInPaise };
}

type QuotationSeed = Omit<
  Quotation,
  "itemCount" | "subtotalInPaise" | "gstInPaise" | "totalInPaise"
>;

/** Totals exist only once Kannali has quoted every line. */
function quotation(seed: QuotationSeed): Quotation {
  const isQuoted = seed.items.every((line) => line.quotedPriceInPaise !== undefined);
  if (!isQuoted) return { ...seed, itemCount: seed.items.length };

  const { subtotalInPaise, gstInPaise } = summarisePricing(
    seed.items.map((line) => ({
      ...line,
      unitPriceInPaise: line.quotedPriceInPaise ?? line.listPriceInPaise,
    })),
  );
  return {
    ...seed,
    itemCount: seed.items.length,
    subtotalInPaise,
    gstInPaise,
    totalInPaise: subtotalInPaise + gstInPaise,
  };
}

export const quotations: Quotation[] = [
  quotation({
    id: "qt-0096",
    number: "QT-2026-0096",
    status: "requested",
    requestedAt: daysFromToday(-1, 17, 20),
    quotedAt: daysFromToday(-1, 17, 20),
    branch: HSR,
    items: [
      quotationLine("p-exide-xltz9", 6),
      quotationLine("p-philips-ultinon-hs1", 10),
      quotationLine("p-tvs-protorq-140-70-17", 4),
    ],
    customerNotes:
      "Need these for a fleet service contract starting next month. Please share your best price and lead time for the batteries.",
    attachments: [],
    timeline: [
      { status: "requested", at: daysFromToday(-1, 17, 20) },
      { status: "quoted", at: daysFromToday(-1, 17, 20), note: "Priced at your business prices" },
      {
        status: "requested",
        at: daysFromToday(-1, 17, 45),
        note: "You asked for a revision: best price on 6 batteries, and the lead time",
      },
    ],
  }),
  quotation({
    id: "qt-0093",
    number: "QT-2026-0093",
    status: "quoted",
    requestedAt: daysFromToday(-4, 10, 15),
    quotedAt: daysFromToday(-2, 15, 30),
    validUntil: daysFromToday(5, 23, 59),
    branch: WHITEFIELD,
    items: [
      quotationLine("p-motul-3100-10w30", 48, 37900),
      quotationLine("p-bosch-pads-pulsar", 30, 28200),
      quotationLine("p-amaron-etz7", 6, 168500),
      quotationLine("p-mrf-zapper-100-90-17", 6, 162000),
    ],
    customerNotes: "Monthly stock for the Whitefield workshop.",
    kannaliNotes:
      "Special pricing on Motul 3100 and Bosch pads for this volume. Amaron batteries ship from our Peenya warehouse within 2 working days of the order.",
    attachments: [
      {
        id: "att-0093-1",
        name: "QT-2026-0093.pdf",
        sizeInBytes: 1_420,
        url: "/documents/QT-2026-0093.pdf",
      },
    ],
    timeline: [
      { status: "requested", at: daysFromToday(-4, 10, 15) },
      { status: "quoted", at: daysFromToday(-2, 15, 30), note: "Quoted by Anitha, Kannali sales" },
    ],
  }),
  quotation({
    id: "qt-0088",
    number: "QT-2026-0088",
    status: "accepted",
    requestedAt: daysFromToday(-7, 11),
    quotedAt: daysFromToday(-5, 16, 10),
    validUntil: daysFromToday(2, 23, 59),
    branch: WHITEFIELD,
    items: [
      quotationLine("p-castrol-power1-15w50", 60, 34500),
      quotationLine("p-rolon-kit-classic", 10, 164000),
      quotationLine("p-re-pads-classic", 12, 52000),
      quotationLine("p-re-oil-filter", 60, 10500),
      quotationLine("p-shell-ultra-15w50", 12, 59500),
    ],
    customerNotes: "Royal Enfield service camp on the 3rd weekend. Need everything by then.",
    kannaliNotes: "Camp pricing approved. Delivery within 3 working days of the order.",
    attachments: [
      {
        id: "att-0088-1",
        name: "QT-2026-0088.pdf",
        sizeInBytes: 1_501,
        url: "/documents/QT-2026-0088.pdf",
      },
    ],
    order: { id: "ord-0417", number: "ORD-2026-0417" },
    timeline: [
      { status: "requested", at: daysFromToday(-7, 11) },
      { status: "quoted", at: daysFromToday(-5, 16, 10), note: "Quoted by Anitha, Kannali sales" },
      { status: "accepted", at: daysFromToday(-2, 11, 18), note: "Converted to ORD-2026-0417" },
    ],
  }),
  quotation({
    id: "qt-0079",
    number: "QT-2026-0079",
    status: "expired",
    requestedAt: daysFromToday(-30, 12, 40),
    quotedAt: daysFromToday(-28, 11),
    validUntil: daysFromToday(-21, 23, 59),
    branch: HSR,
    items: [
      quotationLine("p-steelbird-sba1", 20, 99000),
      quotationLine("p-minda-indicator", 20, 22500),
    ],
    kannaliNotes: "Festive-season helmet pricing.",
    attachments: [],
    timeline: [
      { status: "requested", at: daysFromToday(-30, 12, 40) },
      { status: "quoted", at: daysFromToday(-28, 11) },
      { status: "expired", at: daysFromToday(-21, 23, 59) },
    ],
  }),
];

function toSummary({ items, timeline, attachments, ...summary }: Quotation): QuotationSummary {
  return summary;
}

export async function getQuotationsMock({
  status,
  sort = "requestedAt",
  order = "desc",
  page,
  pageSize,
}: QuotationFilters): Promise<Paginated<QuotationSummary>> {
  await simulateLatency();
  const matching = quotations.filter((q) => !status || q.status === status);
  return paginate(sortItems(matching, sort, order).map(toSummary), page, pageSize);
}

export async function getQuotationMock(id: string): Promise<Quotation | null> {
  await simulateLatency();
  return quotations.find((quotation) => quotation.id === id) ?? null;
}

function update(id: string, changes: (quotation: Quotation) => Partial<Quotation>): Quotation {
  const index = quotations.findIndex((quotation) => quotation.id === id);
  if (index === -1) throw new ApiError(404, { message: "We couldn't find that quotation." });
  quotations[index] = { ...quotations[index], ...changes(quotations[index]) };
  return quotations[index];
}

function requireStatus(id: string, status: Quotation["status"]) {
  if (findById(quotations, id).status !== status) {
    throw new ApiError(409, { message: "This quotation has changed. Refresh the page to see it." });
  }
}

export async function requestQuotationMock(request: QuotationRequest): Promise<Quotation> {
  await simulateLatency(700);
  const latest = Math.max(...quotations.map((q) => Number(q.number.slice(-4))));
  const serial = String(latest + 1).padStart(4, "0");
  const now = new Date().toISOString();
  const { id, name } = findById(branches, request.branchId);
  // Quotations are priced straight away at the business prices; Kannali steps in on a revision.
  const created = quotation({
    id: `qt-${serial}`,
    number: `QT-2026-${serial}`,
    status: "quoted",
    requestedAt: now,
    quotedAt: now,
    // Valid until the end of the 7th day.
    validUntil: daysFromToday(QUOTATION_VALIDITY_DAYS, 23, 59),
    branch: { id, name },
    items: request.items.map(({ productId, quantity }) => quotationLine(productId, quantity)),
    customerNotes: request.notes,
    attachments: [],
    timeline: [
      { status: "requested", at: now },
      { status: "quoted", at: now, note: "Priced at your business prices" },
    ],
  });
  quotations.unshift(created);
  return created;
}

/**
 * Accepting a quotation is checking out with it: the order takes the quotation's lines at the
 * quoted prices and its delivery branch, whatever the browser sends.
 */
export async function placeQuotationOrderMock(request: PlaceOrderRequest): Promise<PlacedOrder> {
  await simulateLatency(900);
  const id = request.quotationId ?? "";
  requireStatus(id, "quoted");
  const quote = findById(quotations, id);
  if (quote.validUntil && new Date(quote.validUntil) < new Date()) {
    throw new ApiError(409, { message: "This quotation has expired. Request a new one." });
  }
  if (request.payment.method === "credit") {
    const credit = await getCreditSummaryMock();
    if ((quote.totalInPaise ?? 0) > credit.availableInPaise) {
      throw new ApiError(422, {
        message: "This order is more than your available credit. Choose another way to pay.",
      });
    }
  }
  const created = createOrder({
    branchId: quote.branch.id,
    poNumber: request.poNumber,
    poDate: request.poDate,
    notes: request.notes,
    quotationId: quote.id,
    payment: toOrderPayment(request.payment),
    items: quote.items.map((line) =>
      orderLine(line.productId, line.quantity, line.quotedPriceInPaise),
    ),
  });
  update(id, ({ timeline }) => ({
    status: "accepted",
    order: { id: created.id, number: created.number },
    timeline: [
      ...timeline,
      { status: "accepted", at: created.placedAt, note: `Converted to ${created.number}` },
    ],
  }));
  return { id: created.id, number: created.number };
}

/** Sends the quotation back to Kannali with a comment; it waits for a new quote. */
export async function requestRevisionMock(id: string, comment: string): Promise<Quotation> {
  await simulateLatency(600);
  requireStatus(id, "quoted");
  return update(id, ({ timeline }) => ({
    status: "requested",
    validUntil: undefined,
    timeline: [
      ...timeline,
      {
        status: "requested",
        at: new Date().toISOString(),
        note: `You asked for a revision: ${comment}`,
      },
    ],
  }));
}

export async function rejectQuotationMock(id: string, reason?: string): Promise<Quotation> {
  await simulateLatency(600);
  requireStatus(id, "quoted");
  return update(id, ({ timeline }) => ({
    status: "rejected",
    timeline: [
      ...timeline,
      {
        status: "rejected",
        at: new Date().toISOString(),
        note: reason ? `Your reason: ${reason}` : undefined,
      },
    ],
  }));
}
