"use client";

import { Controller, type Control } from "react-hook-form";

import { FormTextField } from "@/components/ui/FormTextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { CheckoutValues } from "@/features/checkout/schemas";
import { RAZORPAY_CHANNEL_LABELS } from "@/features/orders/utils";
import { BankTransferDetails } from "@/features/payments/components/BankTransferDetails";

type PaymentMethodDetailsProps = {
  control: Control<CheckoutValues>;
  method: CheckoutValues["paymentMethod"];
};

/** What the chosen payment method needs: a Razorpay channel, or Kannali's bank details. */
export function PaymentMethodDetails({ control, method }: PaymentMethodDetailsProps) {
  if (method === "razorpay") {
    return (
      <Controller
        control={control}
        name="razorpayChannel"
        render={({ field }) => (
          <RadioGroup
            aria-label="Pay with"
            value={field.value}
            onValueChange={field.onChange}
            className="flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <span aria-hidden className="text-sm font-medium text-gray-900">
              Pay with:
            </span>
            {Object.entries(RAZORPAY_CHANNEL_LABELS).map(([value, label]) => (
              <label
                key={value}
                htmlFor={`channel-${value}`}
                className="flex min-h-10 items-center gap-2 text-sm text-gray-700"
              >
                <RadioGroupItem id={`channel-${value}`} value={value} />
                {label}
              </label>
            ))}
          </RadioGroup>
        )}
      />
    );
  }

  if (method === "bank_transfer") {
    return (
      <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-700">
          Transfer the order total to this account and quote your order number. You can also do it
          after placing the order.
        </p>
        <BankTransferDetails />
        <FormTextField
          control={control}
          name="transferReference"
          label="UTR or transfer reference (optional)"
          placeholder="e.g. HDFCN52026102145871"
          description="Helps Kannali match your payment faster."
        />
      </div>
    );
  }

  return null;
}
