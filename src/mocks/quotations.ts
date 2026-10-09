import type {
  Quotation,
  QuotationFilters,
  QuotationLine,
  QuotationSummary,
} from "@/features/quotations/types";
import type { Paginated } from "@/lib/types";
import { summarisePricing } from "@/lib/pricing";
import { lineFor } from "@/mocks/catalog";
import { daysFromToday, paginate, simulateLatency, sortItems } from "@/mocks/utils";

const WHITEFIELD = { id: "br-whitefield", name: "Whitefield" };
const HSR = { id: "br-hsr", name: "HSR Layout" };

function quotationLine(
  productId: string,
  quantity: number,
  quotedPriceInPaise?: number,
): QuotationLine {
  return { ...lineFor(productId, quantity), quotedPriceInPaise };
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
    branch: HSR,
    items: [
      quotationLine("p-exide-xltz9", 6),
      quotationLine("p-philips-ultinon-hs1", 10),
      quotationLine("p-tvs-protorq-140-70-17", 4),
    ],
    customerNotes:
      "Need these for a fleet service contract starting next month. Please share your best price and lead time for the batteries.",
    attachments: [],
    timeline: [{ status: "requested", at: daysFromToday(-1, 17, 20) }],
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
        sizeInBytes: 184_320,
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
        sizeInBytes: 201_728,
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
