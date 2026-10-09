import type { TimelineStep } from "@/components/ui/Timeline";
import type { Quotation, QuotationLine } from "@/features/quotations/types";
import { daysFromToday } from "@/lib/dates";
import { formatCount, formatDate, formatDateTime } from "@/lib/format";

const EVENT_LABELS = {
  requested: "Requested",
  quoted: "Quoted by Kannali",
  accepted: "Accepted and ordered",
  rejected: "Rejected",
  expired: "Expired",
};

/** What has happened so far, then what the quotation is waiting for. */
export function getQuotationSteps(quotation: Quotation): TimelineStep[] {
  const history: TimelineStep[] = quotation.timeline.map((event) => ({
    label: EVENT_LABELS[event.status],
    when: formatDateTime(event.at),
    note: event.note,
    state: event.status === "rejected" || event.status === "expired" ? "stopped" : "done",
  }));

  if (quotation.status === "requested") {
    return [
      ...history,
      {
        label: "Kannali prepares your quote",
        note: "Usually within 1 working day",
        state: "current",
      },
      { label: "You accept or ask for changes", state: "upcoming" },
    ];
  }
  if (quotation.status === "quoted") {
    return [...history, { label: "Waiting for your decision", state: "current" }];
  }
  return history;
}

/** How far below the standard business price the quote is, as a whole percentage. */
export function getDiscountPercent({ listPriceInPaise, quotedPriceInPaise }: QuotationLine) {
  if (quotedPriceInPaise === undefined || listPriceInPaise === 0) return null;
  return Math.round(((listPriceInPaise - quotedPriceInPaise) / listPriceInPaise) * 100);
}

/** "Valid for 5 more days (until 14 Oct 2026)", "Last day today", "Expired on 3 Oct 2026". */
export function describeValidity(validUntil: string): { text: string; isUrgent: boolean } {
  const daysLeft = daysFromToday(validUntil);
  if (daysLeft < 0) return { text: `Expired on ${formatDate(validUntil)}`, isUrgent: false };
  if (daysLeft === 0) return { text: "Last day to accept: today", isUrgent: true };
  return {
    text: `Valid for ${formatCount(daysLeft, "more day")} (until ${formatDate(validUntil)})`,
    isUrgent: daysLeft <= 2,
  };
}
