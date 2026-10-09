"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { getOrder } from "@/features/orders/api";
import { getErrorMessage } from "@/lib/api-client";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

type ReorderButtonProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  orderId: string;
  orderNumber: string;
};

/** Puts every line of a past order back in the cart, at today's prices. */
export function ReorderButton({
  orderId,
  orderNumber,
  children,
  ...buttonProps
}: ReorderButtonProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isPending, setIsPending] = useState(false);

  async function handleReorder() {
    setIsPending(true);
    try {
      const order = await getOrder(orderId);
      if (!order) throw new Error("Order not found");
      for (const line of order.items) addItem(line.productId, line.quantity);
      toast.success(
        `${formatCount(order.items.length, "item")} from ${orderNumber} added to cart`,
        {
          action: { label: "View cart", onClick: () => router.push("/cart") },
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button {...buttonProps} onClick={handleReorder} disabled={isPending} aria-busy={isPending}>
      <RotateCcw aria-hidden className={cn(isPending && "animate-spin")} />
      {children ?? "Reorder"}
    </Button>
  );
}
