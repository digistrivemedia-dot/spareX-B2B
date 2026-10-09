import { FilePlus2, Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ReorderButton } from "@/features/orders/components/ReorderButton";
import type { OrderSummary } from "@/features/orders/types";

type QuickActionsProps = {
  /** The most recent order that can be reordered, if there is one. */
  lastOrder?: Pick<OrderSummary, "id" | "number">;
};

export function QuickActions({ lastOrder }: QuickActionsProps) {
  return (
    <>
      {lastOrder && (
        <ReorderButton variant="outline" orderId={lastOrder.id} orderNumber={lastOrder.number}>
          Reorder last order
        </ReorderButton>
      )}
      <Button variant="outline" asChild>
        <Link href="/quotations/new">
          <FilePlus2 aria-hidden />
          Request quotation
        </Link>
      </Button>
      <Button asChild>
        <Link href="/quick-order">
          <Zap aria-hidden />
          Quick order
        </Link>
      </Button>
    </>
  );
}
