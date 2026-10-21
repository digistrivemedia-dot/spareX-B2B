import type { TimelineStep } from "@/components/ui/Timeline";
import type { Order } from "@/features/orders/types";
import type { ReturnReason, ReturnRequest } from "@/features/returns/types";
import { formatDateTime } from "@/lib/format";

export const RETURN_REASON_LABELS: Record<ReturnReason, string> = {
  damaged_in_transit: "Damaged in transit",
  wrong_part: "Wrong part delivered",
  does_not_fit: "Doesn't fit the vehicle",
  defective: "Defective or not working",
  not_needed: "No longer needed",
};

/** Reasons Kannali needs to see, so at least one photo is required. */
export const PHOTO_REQUIRED_REASONS: ReturnReason[] = ["damaged_in_transit", "defective"];

export const MAX_RETURN_PHOTOS = 4;

const RETURN_FLOW = [
  { status: "requested", label: "Return requested" },
  { status: "approved", label: "Approved by Kannali" },
  { status: "picked_up", label: "Picked up" },
  { status: "refunded", label: "Refunded" },
] as const;

/** Requested → Approved → Picked up → Refunded, or stopped at Rejected. */
export function getReturnSteps({
  status,
  timeline,
  rejectionReason,
}: ReturnRequest): TimelineStep[] {
  const reachedAt = new Map(timeline.map((event) => [event.status, event.at]));

  if (status === "rejected") {
    return timeline.map((event) => ({
      label: event.status === "rejected" ? "Rejected" : "Return requested",
      when: formatDateTime(event.at),
      note: event.status === "rejected" ? rejectionReason : undefined,
      state: event.status === "rejected" ? "stopped" : "done",
    }));
  }

  const currentIndex = RETURN_FLOW.findIndex((step) => step.status === status);
  return RETURN_FLOW.map(({ status: step, label }, index) => {
    const at = reachedAt.get(step);
    const isNext = index === currentIndex + 1;
    return {
      label,
      when: at ? formatDateTime(at) : undefined,
      state: at ? "done" : isNext ? "current" : "upcoming",
    };
  });
}

/** Returns are for delivered orders only. */
export function canReturn(order: Pick<Order, "status">): boolean {
  return order.status === "delivered";
}
