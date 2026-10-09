import { cva } from "class-variance-authority";
import { ArrowRight, CircleAlert, FileClock, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { formatCount, formatPrice } from "@/lib/format";

const alertVariants = cva(
  "flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3 text-sm",
  {
    variants: {
      tone: {
        danger: "border-danger-600/20 bg-danger-50 text-danger-700",
        warning: "border-warning-500/30 bg-warning-50 text-warning-700",
      },
    },
  },
);

type Alert = {
  tone: "danger" | "warning";
  icon: LucideIcon;
  message: string;
  action: { label: string; href: string };
};

type AttentionBarProps = {
  overdueInPaise: number;
  overdueInvoiceCount: number;
  quotationsAwaiting: number;
};

/** What needs doing first: overdue invoices and quotations waiting on a reply. Hidden when nothing does. */
export function AttentionBar({
  overdueInPaise,
  overdueInvoiceCount,
  quotationsAwaiting,
}: AttentionBarProps) {
  const alerts: Alert[] = [];
  if (overdueInvoiceCount > 0) {
    alerts.push({
      tone: "danger",
      icon: CircleAlert,
      message: `${formatCount(overdueInvoiceCount, "invoice")} overdue · ${formatPrice(overdueInPaise)}`,
      action: { label: "Pay now", href: "/credit" },
    });
  }
  if (quotationsAwaiting > 0) {
    alerts.push({
      tone: "warning",
      icon: FileClock,
      message: `${formatCount(quotationsAwaiting, "quotation")} awaiting your response`,
      action: { label: "Review", href: "/quotations?status=quoted" },
    });
  }

  if (alerts.length === 0) return null;

  return (
    <section aria-label="Needs your attention" className="mb-6 flex flex-col gap-3 md:flex-row">
      {alerts.map(({ tone, icon: Icon, message, action }) => (
        <div key={message} className={alertVariants({ tone })}>
          <Icon aria-hidden className="size-4 shrink-0" />
          <p className="font-medium">{message}</p>
          <Link
            href={action.href}
            className="ml-auto inline-flex items-center gap-1 font-semibold underline-offset-4 hover:underline"
          >
            {action.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      ))}
    </section>
  );
}
