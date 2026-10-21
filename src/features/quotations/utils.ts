import type { TimelineStep } from "@/components/ui/Timeline";
import type { Quotation, QuotationLine } from "@/features/quotations/types";
import { daysFromToday } from "@/lib/dates";
import { formatDate, formatDateTime } from "@/lib/format";

const EVENT_LABELS = {
  requested: "Requested",
  quoted: "Quoted",
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
        label: "Kannali revises your quote",
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

/** Every quotation can be accepted for this many days after it is priced. */
export const QUOTATION_VALIDITY_DAYS = 7;

type Validity = { daysLeft: number; text: string; isUrgent: boolean };

/** "5 of 7 days left (until 14 Oct 2026)", "Last day to accept: today", "Expired on 3 Oct 2026". */
export function describeValidity(validUntil: string): Validity {
  const daysLeft = daysFromToday(validUntil);
  if (daysLeft < 0) {
    return { daysLeft, text: `Expired on ${formatDate(validUntil)}`, isUrgent: false };
  }
  if (daysLeft === 0) return { daysLeft, text: "Last day to accept: today", isUrgent: true };
  return {
    daysLeft,
    text: `${daysLeft} of ${QUOTATION_VALIDITY_DAYS} days left (until ${formatDate(validUntil)})`,
    isUrgent: daysLeft <= 2,
  };
}
