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
import { PaymentOptions } from "@/features/checkout/components/PaymentOptions";
import { PurchaseOrderFields } from "@/features/checkout/components/PurchaseOrderFields";
import { checkoutSchema, type CheckoutValues } from "@/features/checkout/schemas";
import type { CreditSummary } from "@/features/credit/types";
import { placeOrderAction } from "@/features/orders/actions";
import type { PlacedOrder, PlaceOrderRequest } from "@/features/orders/types";
import { formatPrice } from "@/lib/format";
import type { OrderTotals } from "@/lib/pricing";

type CheckoutFormProps = {
  /** What is being ordered; the server prices it. */
  items: PlaceOrderRequest["items"];
  totals: OrderTotals;
  /** The summary's savings line, e.g. "You save against B2C prices". */
  savingsLabel: string;
  /** Null when credit isn't enabled for this business. */
  credit: CreditSummary | null;
  branchId: string;
  /** The delivery section: branch choices for the cart, the fixed branch for a quotation. */
  delivery: ReactNode;
  /** Set when ordering a quotation at its quoted prices. */
  quotationId?: string;
  /** Lines that can't be delivered from the chosen branch; checkout waits until they're fixed. */
  blockingCount?: number;
  backLink: { href: string; label: string };
  onPlaced: (order: PlacedOrder) => void;
};

export function CheckoutForm({
  items,
  totals,
  savingsLabel,
  credit,
  branchId,
  delivery,
  quotationId,
  blockingCount = 0,
  backLink,
  onPlaced,
}: CheckoutFormProps) {
  const canUseCredit = credit !== null && totals.totalInPaise <= credit.availableInPaise;
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      poNumber: "",
      poDate: "",
      notes: "",
      paymentMethod: canUseCredit ? "credit" : "razorpay",
      razorpayChannel: "upi",
      transferReference: "",
    },
  });
  const { isSubmitting, errors } = form.formState;

  async function onSubmit(values: CheckoutValues) {
    if (values.paymentMethod === "credit" && !canUseCredit) {
      return form.setError("paymentMethod", {
        message: "Not enough credit: please choose another way to pay.",
      });
    }
    const result = await placeOrderAction({
      quotationId,
      branchId,
      poNumber: values.poNumber || undefined,
      poDate: values.poDate || undefined,
      notes: values.notes || undefined,
      payment: toPayment(values),
      items,
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
          {delivery}
        </CheckoutSection>
        <CheckoutSection step={2} title="Purchase order">
          <PurchaseOrderFields control={form.control} />
        </CheckoutSection>
        <CheckoutSection step={3} title="Payment">
          <PaymentOptions control={form.control} credit={credit} canUseCredit={canUseCredit} />
        </CheckoutSection>
      </div>

      <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
        <OrderSummaryCard totals={totals} itemCount={items.length} savingsLabel={savingsLabel}>
          <FormAlert message={errors.root?.message} />
          {blockingCount > 0 && (
            <FormAlert message="Some parts can't be delivered from this branch. Choose another branch or fix the cart." />
          )}
          <SubmitButton size="lg" isPending={isSubmitting} disabled={blockingCount > 0}>
            Place order · {formatPrice(totals.totalInPaise)}
          </SubmitButton>
          <Button variant="ghost" asChild>
            <Link href={backLink.href}>{backLink.label}</Link>
          </Button>
        </OrderSummaryCard>
      </aside>
    </form>
  );
}

function toPayment(values: CheckoutValues): PlaceOrderRequest["payment"] {
  switch (values.paymentMethod) {
    case "razorpay":
      return { method: "razorpay", channel: values.razorpayChannel };
    case "bank_transfer":
      return { method: "bank_transfer", transferReference: values.transferReference || undefined };
    default:
      return { method: values.paymentMethod };
  }
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
