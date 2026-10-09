"use client";

import { CreditCard, Wallet } from "lucide-react";
import { Controller, useWatch, type Control } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChoiceCard } from "@/features/checkout/components/ChoiceCard";
import type { CheckoutValues } from "@/features/checkout/schemas";
import type { CreditSummary } from "@/features/credit/types";
import { formatPrice } from "@/lib/format";

const ONLINE_CHANNELS = [
  { value: "upi", label: "UPI" },
  { value: "netbanking", label: "Net banking" },
  { value: "card", label: "Card" },
];

type PaymentOptionsProps = {
  control: Control<CheckoutValues>;
  credit: CreditSummary;
  /** False when the order is more than the credit available. */
  canUseCredit: boolean;
};

export function PaymentOptions({ control, credit, canUseCredit }: PaymentOptionsProps) {
  const method = useWatch({ control, name: "paymentMethod" });

  return (
    <Controller
      control={control}
      name="paymentMethod"
      render={({ field, fieldState }) => (
        <>
          <RadioGroup
            aria-label="Payment"
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-3 sm:grid-cols-2"
          >
            <ChoiceCard
              id="pay-credit"
              value="credit"
              title="Use credit"
              icon={Wallet}
              disabled={!canUseCredit}
            >
              <p>
                {formatPrice(credit.availableInPaise)} available · Net {credit.termsDays}: pay
                within {credit.termsDays} days of the invoice
              </p>
              {!canUseCredit && (
                <p className="mt-1 text-xs font-medium text-danger-700">
                  This order is more than your available credit. Pay online, or clear some
                  outstanding invoices first.
                </p>
              )}
              {canUseCredit && credit.overdueInPaise > 0 && (
                <p className="mt-1 text-xs font-medium text-warning-700">
                  You have {formatPrice(credit.overdueInPaise)} overdue. Please clear it soon.
                </p>
              )}
            </ChoiceCard>
            <ChoiceCard id="pay-online" value="online" title="Pay online" icon={CreditCard}>
              <p>UPI, net banking or card. Demo only: no money is taken.</p>
            </ChoiceCard>
          </RadioGroup>
          <FieldError errors={[fieldState.error]} />

          {method === "online" && (
            <Controller
              control={control}
              name="onlineChannel"
              render={({ field: channel }) => (
                <RadioGroup
                  aria-label="Pay online with"
                  value={channel.value}
                  onValueChange={channel.onChange}
                  className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3"
                >
                  <span aria-hidden className="text-sm font-medium text-gray-900">
                    Pay with:
                  </span>
                  {ONLINE_CHANNELS.map((option) => (
                    <label
                      key={option.value}
                      htmlFor={`channel-${option.value}`}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <RadioGroupItem id={`channel-${option.value}`} value={option.value} />
                      {option.label}
                    </label>
                  ))}
                </RadioGroup>
              )}
            />
          )}
        </>
      )}
    />
  );
}
