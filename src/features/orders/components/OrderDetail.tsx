import Link from "next/link";
import type { ReactNode } from "react";

import { SectionHeader } from "@/components/layout/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Timeline } from "@/components/ui/Timeline";
import { OrderSummaryCard } from "@/features/cart/components/OrderSummaryCard";
import type { Branch } from "@/features/company/types";
import { OrderActions } from "@/features/orders/components/OrderActions";
import { OrderItemsTable } from "@/features/orders/components/OrderItemsTable";
import { OrderPaymentDetails } from "@/features/orders/components/OrderPaymentDetails";
import { OrderReturnsCard } from "@/features/orders/components/OrderReturnsCard";
import type { Order } from "@/features/orders/types";
import { CANCELLATION_REASON_LABELS, getOrderSteps } from "@/features/orders/utils";
import type { ReturnSummary } from "@/features/returns/types";
import { formatDate, formatDateTime, formatPhone } from "@/lib/format";

type OrderDetailProps = {
  order: Order;
  /** The full delivery branch, for its address. */
  branch?: Branch;
  returns: ReturnSummary[];
};

export function OrderDetail({ order, branch, returns }: OrderDetailProps) {
  const isOpen = order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <section>
          <SectionHeader title="Items" />
          <OrderItemsTable items={order.items} />
        </section>
        <div className="grid gap-6 lg:grid-cols-2">
          <InfoCard title="Delivery">
            <Detail label="Branch" value={order.branch.name} />
            {branch && (
              <Detail
                label="Address"
                value={`${[branch.address.line1, branch.address.line2, branch.address.city].join(", ")} ${branch.address.pin}`}
              />
            )}
            {branch && (
              <Detail
                label="Contact"
                value={`${branch.contactName} · ${formatPhone(branch.contactPhone)}`}
              />
            )}
            {order.expectedDeliveryDate && (
              <Detail
                label={isOpen ? "Expected" : "Planned for"}
                value={formatDate(order.expectedDeliveryDate)}
              />
            )}
            {order.notes && <Detail label="Notes" value={order.notes} />}
          </InfoCard>
          <InfoCard title="Purchase order">
            <Detail label="PO number" value={order.poNumber ?? "None given"} />
            <Detail label="PO date" value={order.poDate ? formatDate(order.poDate) : "—"} />
            {order.quotationId && (
              <div className="flex flex-col gap-0.5">
                <dt className="text-gray-500">From quotation</dt>
                <dd>
                  <Link
                    href={`/quotations/${order.quotationId}`}
                    className="font-medium text-navy-700 hover:underline"
                  >
                    View quotation
                  </Link>
                </dd>
              </div>
            )}
            <Detail
              label="Invoice"
              value={
                order.invoice?.number ??
                (order.status === "cancelled"
                  ? "None: order cancelled"
                  : "Raised when the order ships")
              }
            />
          </InfoCard>
        </div>
        {order.cancellation && (
          <InfoCard title="Cancellation">
            <Detail label="Reason" value={CANCELLATION_REASON_LABELS[order.cancellation.reason]} />
            {order.cancellation.note && (
              <Detail label="Your note" value={order.cancellation.note} />
            )}
            <Detail label="Cancelled on" value={formatDateTime(order.cancellation.at)} />
          </InfoCard>
        )}
        {returns.length > 0 && <OrderReturnsCard returns={returns} />}
        <OrderSummaryCard totals={order} itemCount={order.itemCount} />
      </div>

      {/* Below xl the aside dissolves so status and actions lead the page and the journey closes it. */}
      <aside className="contents xl:sticky xl:top-20 xl:flex xl:w-80 xl:shrink-0 xl:flex-col xl:gap-6">
        <Card className="order-first xl:order-none">
          <CardContent className="flex flex-col gap-4">
            <StatusBadge status={order.status} className="self-start" />
            <OrderPaymentDetails order={order} />
            <OrderActions order={order} />
          </CardContent>
        </Card>
        <InfoCard title="Delivery progress" className="order-last xl:order-none">
          <Timeline label="Order progress" steps={getOrderSteps(order)} />
        </InfoCard>
      </aside>
    </div>
  );
}

type InfoCardProps = { title: string; children: ReactNode; className?: string };

function InfoCard({ title, children, className }: InfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-3 text-sm">{children}</dl>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}
