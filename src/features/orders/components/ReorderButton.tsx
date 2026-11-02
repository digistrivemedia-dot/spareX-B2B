"use client";

import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ComponentProps } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/features/cart/store";
import { getReorderItemsAction } from "@/features/orders/actions";
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
    const result = await getReorderItemsAction(orderId);
    setIsPending(false);
    if (!result.ok) return toast.error(result.message);
    for (const line of result.data) addItem(line.productId, line.quantity);
    toast.success(`${formatCount(result.data.length, "item")} from ${orderNumber} added to cart`, {
      action: { label: "View cart", onClick: () => router.push("/cart") },
    });
  }

  return (
    <Button {...buttonProps} onClick={handleReorder} disabled={isPending} aria-busy={isPending}>
      <RotateCcw aria-hidden className={cn(isPending && "animate-spin")} />
      {children ?? "Reorder"}
    </Button>
  );
}
