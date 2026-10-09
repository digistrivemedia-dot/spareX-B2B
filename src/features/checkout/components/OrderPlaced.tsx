import { CircleCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/features/orders/types";
import { formatDate, formatPrice } from "@/lib/format";

const CHANNEL_LABELS = { upi: "UPI", netbanking: "net banking", card: "card" };

function describePayment({ payment }: Order, termsDays: number) {
  if (payment.method === "credit") {
    return `On credit · Net ${termsDays}: due ${termsDays} days after the invoice`;
  }
  return `Paid online${payment.channel ? ` by ${CHANNEL_LABELS[payment.channel]}` : ""}`;
}

type OrderPlacedProps = {
  order: Order;
  termsDays: number;
};

/** The confirmation shown straight after checkout. */
export function OrderPlaced({ order, termsDays }: OrderPlacedProps) {
  const details = [
    { label: "Order number", value: order.number },
    { label: "Your PO number", value: order.poNumber ?? "None given" },
    { label: "Delivering to", value: order.branch.name },
    {
      label: "Expected delivery",
      value: order.expectedDeliveryDate
        ? formatDate(order.expectedDeliveryDate)
        : "We'll confirm by SMS",
    },
    { label: "Payment", value: describePayment(order, termsDays) },
    { label: "Total (incl. GST)", value: formatPrice(order.totalInPaise) },
  ];

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-success-50 text-success-700">
            <CircleCheck aria-hidden className="size-6" />
          </span>
          <h1 className="text-2xl font-semibold text-gray-900">Order placed</h1>
          <p className="text-sm text-gray-500">
            Thank you. We&apos;ve sent the details to your email and will SMS you when it ships.
          </p>
        </div>

        <dl className="grid gap-x-6 gap-y-3 rounded-lg bg-gray-50 p-4 text-sm sm:grid-cols-2">
          {details.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium text-gray-900 tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <Button variant="outline" asChild>
            <Link href="/catalog">Continue shopping</Link>
          </Button>
          <Button asChild>
            <Link href={`/orders/${order.id}`}>View order</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
