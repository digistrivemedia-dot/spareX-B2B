import { StatusBadge } from "@/components/ui/StatusBadge";
import type { OrderPayment } from "@/features/orders/types";
import { RAZORPAY_CHANNEL_LABELS } from "@/features/orders/utils";
import { daysFromToday } from "@/lib/dates";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const PAID_BY = { razorpay: "", bank_transfer: "bank transfer", cod: "cash", credit: "credit" };

/** "Paid · UPI", "Awaiting bank transfer", "Cash on delivery", "Credit · due 12 Oct 2026"… */
export function OrderPaymentStatus({ payment }: { payment: OrderPayment }) {
  if (payment.status === "cancelled") return <span className="text-gray-500">—</span>;
  if (payment.status === "paid") {
    const by = payment.channel ? RAZORPAY_CHANNEL_LABELS[payment.channel] : PAID_BY[payment.method];
    return <StatusBadge status="paid">Paid{by ? ` · ${by}` : ""}</StatusBadge>;
  }
  if (payment.method === "bank_transfer") {
    return <span className="text-warning-700">Awaiting bank transfer</span>;
  }
  if (payment.method === "cod") return <span className="text-gray-700">Cash on delivery</span>;
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
