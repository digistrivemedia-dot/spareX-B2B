import type { Invoice } from "@/features/credit/types";
import { daysFromToday } from "@/lib/dates";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

/** "9 days overdue" in red, "3 days left" in amber when close, otherwise grey. */
export function DueCountdown({ invoice }: { invoice: Pick<Invoice, "dueDate"> }) {
  const daysLeft = daysFromToday(invoice.dueDate);
  const text =
    daysLeft < 0
      ? `${formatCount(-daysLeft, "day")} overdue`
      : daysLeft === 0
        ? "Due today"
        : `${formatCount(daysLeft, "day")} left`;

  return (
    <span
      className={cn(
        "font-medium whitespace-nowrap",
        daysLeft < 0 ? "text-danger-700" : daysLeft <= 3 ? "text-warning-700" : "text-gray-700",
      )}
    >
      {text}
    </span>
  );
}
