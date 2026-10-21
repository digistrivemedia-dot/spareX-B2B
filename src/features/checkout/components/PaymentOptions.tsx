"use client";

import { Banknote, CreditCard, Landmark, Wallet } from "lucide-react";
import { Controller, useWatch, type Control } from "react-hook-form";

import { FieldError } from "@/components/ui/field";
import { RadioGroup } from "@/components/ui/radio-group";
import { ChoiceCard } from "@/features/checkout/components/ChoiceCard";
import { PaymentMethodDetails } from "@/features/checkout/components/PaymentMethodDetails";
import type { CheckoutValues } from "@/features/checkout/schemas";
import type { CreditSummary } from "@/features/credit/types";
import { formatPrice } from "@/lib/format";

type PaymentOptionsProps = {
  control: Control<CheckoutValues>;
  /** Null when Kannali hasn't enabled credit for this business: the option isn't shown. */
  credit: CreditSummary | null;
  /** False when the order is more than the credit available. */
  canUseCredit: boolean;
};

export function PaymentOptions({ control, credit, canUseCredit }: PaymentOptionsProps) {
  const method = useWatch({ control, name: "paymentMethod" });

  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="paymentMethod"
        render={({ field, fieldState }) => (
          <div>
            <RadioGroup
              aria-label="Payment"
              value={field.value}
              onValueChange={field.onChange}
              className="grid gap-3 sm:grid-cols-2"
            >
              <ChoiceCard id="pay-razorpay" value="razorpay" title="Pay online" icon={CreditCard}>
                <p>UPI, net banking or card through Razorpay. Demo only: no money is taken.</p>
              </ChoiceCard>
              <ChoiceCard
                id="pay-bank-transfer"
                value="bank_transfer"
                title="Bank transfer"
                icon={Landmark}
              >
                <p>NEFT, RTGS or IMPS. We dispatch once Kannali confirms the payment.</p>
              </ChoiceCard>
              <ChoiceCard id="pay-cod" value="cod" title="Cash on delivery" icon={Banknote}>
                <p>Pay the delivery person in cash when the parts arrive.</p>
              </ChoiceCard>
              {credit && (
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
                      This order is more than your available credit. Choose another way to pay, or
                      clear some outstanding invoices first.
                    </p>
                  )}
                  {canUseCredit && credit.overdueInPaise > 0 && (
                    <p className="mt-1 text-xs font-medium text-warning-700">
                      You have {formatPrice(credit.overdueInPaise)} overdue. Please clear it soon.
                    </p>
                  )}
                </ChoiceCard>
              )}
            </RadioGroup>
            <FieldError errors={[fieldState.error]} />
          </div>
        )}
      />
      <PaymentMethodDetails control={control} method={method} />
    </div>
  );
}
