import { FileDown, LifeBuoy, Undo2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CancelOrderDialog } from "@/features/orders/components/CancelOrderDialog";
import { ReorderButton } from "@/features/orders/components/ReorderButton";
import type { Order } from "@/features/orders/types";
import { CANCELLABLE_STATUSES } from "@/features/orders/utils";
import { canReturn } from "@/features/returns/utils";

/** Download the GST invoice, reorder, return or cancel, or get help with this order. */
export function OrderActions({ order }: { order: Order }) {
  const helpSubject = encodeURIComponent(`Help with ${order.number}`);

  return (
    <div className="flex flex-col gap-2">
      {order.invoice ? (
        <Button asChild>
          <a href={order.invoice.pdfUrl} download>
            <FileDown aria-hidden />
            Download GST invoice
          </a>
        </Button>
      ) : (
        <p className="text-sm text-gray-500">
          {order.status === "cancelled"
            ? "No invoice: this order was cancelled."
            : "The GST invoice will be ready when the order ships."}
        </p>
      )}
      {order.status !== "cancelled" && (
        <ReorderButton variant="outline" orderId={order.id} orderNumber={order.number}>
          Reorder
        </ReorderButton>
      )}
      {canReturn(order) && (
        <Button variant="outline" asChild>
          <Link href={`/orders/${order.id}/return`}>
            <Undo2 aria-hidden />
            Return items
          </Link>
        </Button>
      )}
      {CANCELLABLE_STATUSES.includes(order.status) && <CancelOrderDialog order={order} />}
      <Button variant="ghost" asChild>
        {/* Placeholder contact until Kannali confirms its support details (see DECISIONS.md). */}
        <a href={`mailto:support@kannaligarage.example.com?subject=${helpSubject}`}>
          <LifeBuoy aria-hidden />
          Need help with this order?
        </a>
      </Button>
    </div>
  );
}
