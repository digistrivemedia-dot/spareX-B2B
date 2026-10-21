import { PackageX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOrder } from "@/features/orders/api";
import { getReturnedQuantitiesForOrder } from "@/features/returns/api";
import { ReturnForm } from "@/features/returns/components/ReturnForm";
import { canReturn } from "@/features/returns/utils";

export const metadata: Metadata = {
  title: "Return items",
};

type ReturnPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReturnPage({ params }: ReturnPageProps) {
  const { id } = await params;
  const [order, returned] = await Promise.all([getOrder(id), getReturnedQuantitiesForOrder(id)]);
  if (!order) notFound();

  const lines = order.items.map(
    ({ productId, partNumber, name, quantity, unitPriceInPaise, gstRatePercent }) => ({
      productId,
      partNumber,
      name,
      quantity,
      unitPriceInPaise,
      gstRatePercent,
      returnable: quantity - (returned[productId] ?? 0),
    }),
  );
  const hasReturnable = lines.some((line) => line.returnable > 0);

  return (
    <>
      <PageHeader
        title={`Return items from ${order.number}`}
        description="Choose the parts, tell us why, and Kannali arranges a pickup once the return is approved."
      />
      {canReturn(order) && hasReturnable ? (
        <ReturnForm
          orderId={order.id}
          lines={lines}
          refundMethod={order.payment.method === "credit" ? "credit_note" : "original_payment"}
        />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <EmptyState
            icon={PackageX}
            title="Nothing to return on this order"
            description={
              canReturn(order)
                ? "Every part on this order is already in a return."
                : "Returns open once the order is delivered."
            }
            action={
              <Button variant="outline" asChild>
                <Link href={`/orders/${order.id}`}>Back to order</Link>
              </Button>
            }
          />
        </div>
      )}
    </>
  );
}
