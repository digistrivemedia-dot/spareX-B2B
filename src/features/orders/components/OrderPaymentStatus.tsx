import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderPayment } from "@/features/orders/types";
import { daysFromToday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const CHANNELS = { upi: "UPI", netbanking: "net banking", card: "card" };

/** "Credit · due 12 Oct 2026", "Paid online by UPI", "Credit · invoiced at dispatch". */
export function OrderPaymentStatus({ payment }: { payment: OrderPayment }) {
  if (payment.status === "cancelled") return <span className="text-gray-500">—</span>;
  if (payment.status === "paid") {
    return (
      <StatusBadge status="paid">
        Paid{payment.channel ? ` · ${CHANNELS[payment.channel]}` : ""}
      </StatusBadge>
    );
  }
  if (payment.status === "pending" || !payment.dueDate) {
    return <span className="text-gray-600">Credit · invoiced at dispatch</span>;
  }

  const daysLeft = daysFromToday(payment.dueDate);
  return (
    <span
      className={cn(
        daysLeft < 0
          ? "font-medium text-danger-700"
          : daysLeft <= 3
            ? "text-warning-700"
            : "text-gray-700",
      )}
    >
      Credit · {daysLeft < 0 ? "overdue since" : "due"} {formatDate(payment.dueDate)}
    </span>
  );
}
