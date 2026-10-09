"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { OrderSummaryCard } from "@/features/cart/components/OrderSummaryCard";
import type { CartLine } from "@/features/cart/types";
import { BranchOptions } from "@/features/checkout/components/BranchOptions";
import { PaymentOptions } from "@/features/checkout/components/PaymentOptions";
import { PurchaseOrderFields } from "@/features/checkout/components/PurchaseOrderFields";
import { checkoutSchema, type CheckoutValues } from "@/features/checkout/schemas";
import type { CreditSummary } from "@/features/credit/types";
import { placeOrderAction } from "@/features/orders/actions";
import type { PlacedOrder } from "@/features/orders/types";
import { formatPrice } from "@/lib/format";
import type { OrderTotals } from "@/lib/pricing";

type CheckoutFormProps = {
  lines: CartLine[];
  totals: OrderTotals;
  credit: CreditSummary;
  /** The delivery branch chosen above (shared with the top bar's branch switcher). */
  branchId: string;
  /** Lines that can't be delivered from the chosen branch; checkout waits until they're fixed. */
  blockingCount: number;
  onPlaced: (order: PlacedOrder) => void;
};

export function CheckoutForm({
  lines,
  totals,
  credit,
  branchId,
  blockingCount,
  onPlaced,
}: CheckoutFormProps) {
  const canUseCredit = totals.totalInPaise <= credit.availableInPaise;
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      poNumber: "",
      poDate: "",
      notes: "",
      paymentMethod: canUseCredit ? "credit" : "online",
      onlineChannel: "upi",
    },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: CheckoutValues) {
    if (values.paymentMethod === "credit" && !canUseCredit) {
      return form.setError("paymentMethod", { message: "Not enough credit: please pay online." });
    }
    const result = await placeOrderAction({
      branchId,
      poNumber: values.poNumber || undefined,
      poDate: values.poDate || undefined,
      notes: values.notes || undefined,
      payment:
        values.paymentMethod === "credit"
          ? { method: "credit" }
          : { method: "online", channel: values.onlineChannel },
      items: lines.map((line) => ({ productId: line.id, quantity: line.quantity })),
    });
    if (result.ok) onPlaced(result.data);
    else form.setError("root", { message: result.message });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6 xl:flex-row xl:items-start"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <CheckoutSection step={1} title="Delivery branch">
          <BranchOptions />
        </CheckoutSection>
        <CheckoutSection step={2} title="Purchase order">
          <PurchaseOrderFields control={form.control} />
        </CheckoutSection>
        <CheckoutSection step={3} title="Payment">
          <PaymentOptions control={form.control} credit={credit} canUseCredit={canUseCredit} />
        </CheckoutSection>
      </div>

      <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
        <OrderSummaryCard totals={totals} itemCount={lines.length}>
          <FormAlert message={errors.root?.message} />
          {blockingCount > 0 && (
            <FormAlert message="Some parts can't be delivered from this branch. Choose another branch or fix the cart." />
          )}
          <SubmitButton size="lg" isPending={isSubmitting} disabled={blockingCount > 0}>
            Place order · {formatPrice(totals.totalInPaise)}
          </SubmitButton>
          <Button variant="ghost" asChild>
            <Link href="/cart">Back to cart</Link>
          </Button>
        </OrderSummaryCard>
      </aside>
    </form>
  );
}

type CheckoutSectionProps = { step: number; title: string; children: ReactNode };

function CheckoutSection({ step, title, children }: CheckoutSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <span className="flex size-6 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">
            {step}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
