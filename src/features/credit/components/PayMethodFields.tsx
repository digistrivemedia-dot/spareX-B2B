"use client";

import { Controller, type Control } from "react-hook-form";

import { FormTextField } from "@/components/ui/FormTextField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { PayDuesValues } from "@/features/credit/schemas";
import { RAZORPAY_CHANNEL_LABELS } from "@/features/orders/utils";
import { BankTransferDetails } from "@/features/payments/components/BankTransferDetails";

const METHODS = [
  { value: "razorpay", label: "Pay online", hint: "UPI, net banking or card (demo)" },
  { value: "bank_transfer", label: "Bank transfer", hint: "NEFT, RTGS or IMPS" },
];

type PayMethodFieldsProps = {
  control: Control<PayDuesValues>;
  method: PayDuesValues["method"];
};

/** Online through Razorpay, or a bank transfer with its UTR. */
export function PayMethodFields({ control, method }: PayMethodFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="method"
        render={({ field }) => (
          <RadioGroup
            aria-label="Payment method"
            value={field.value}
            onValueChange={field.onChange}
            className="grid gap-2 sm:grid-cols-2"
          >
            {METHODS.map((option) => (
              <label
                key={option.value}
                htmlFor={`pay-method-${option.value}`}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
              >
                <RadioGroupItem
                  id={`pay-method-${option.value}`}
                  value={option.value}
                  className="mt-0.5"
                />
                <span className="flex flex-col">
                  <span className="font-semibold text-gray-900">{option.label}</span>
                  <span className="text-xs text-gray-500">{option.hint}</span>
                </span>
              </label>
            ))}
          </RadioGroup>
        )}
      />
      {method === "razorpay" ? (
        <Controller
          control={control}
          name="channel"
          render={({ field }) => (
            <RadioGroup
              aria-label="Pay with"
              value={field.value}
              onValueChange={field.onChange}
              className="flex flex-wrap gap-x-6 gap-y-2"
            >
              {Object.entries(RAZORPAY_CHANNEL_LABELS).map(([value, label]) => (
                <label
                  key={value}
                  htmlFor={`pay-channel-${value}`}
                  className="flex min-h-10 items-center gap-2 text-sm text-gray-700"
                >
                  <RadioGroupItem id={`pay-channel-${value}`} value={value} />
                  {label}
                </label>
              ))}
            </RadioGroup>
          )}
        />
      ) : (
        <div className="flex flex-col gap-3">
          <BankTransferDetails />
          <FormTextField
            control={control}
            name="transferReference"
            label="UTR or transfer reference"
            placeholder="e.g. HDFCN52026102145871"
            description="Kannali confirms the payment once it reaches the account."
          />
        </div>
      )}
    </div>
  );
}
