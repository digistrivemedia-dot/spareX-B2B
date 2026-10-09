import { FileDown, LifeBuoy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ReorderButton } from "@/features/orders/components/ReorderButton";
import type { Order } from "@/features/orders/types";

/** Download the GST invoice, reorder, or get help with this order. */
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
