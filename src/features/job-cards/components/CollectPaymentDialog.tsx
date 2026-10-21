"use client";

import { Banknote, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/ui/FormAlert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { collectPaymentAction } from "@/features/job-cards/actions";
import { formatPrice } from "@/lib/format";

type CollectPaymentDialogProps = {
  jobId: string;
  amountInPaise: number;
};

/** The customer pays online (UPI or a payment link) or in cash; cash shows the change to give. */
export function CollectPaymentDialog({ jobId, amountInPaise }: CollectPaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [method, setMethod] = useState<"online" | "cash">("online");
  const [reference, setReference] = useState("");
  const [cash, setCash] = useState("");
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const cashInPaise = Math.round(Number(cash || 0) * 100);
  const change = cashInPaise - amountInPaise;

  async function collect() {
    if (method === "online" && reference.trim().length < 6) {
      return setError("Enter the UPI or payment reference from the customer's phone.");
    }
    if (method === "cash" && change < 0) return setError("That's less than the bill.");
    setIsSaving(true);
    const result = await collectPaymentAction(
      jobId,
      method === "online"
        ? { method, reference: reference.trim() }
        : { method, cashReceivedInPaise: cashInPaise },
    );
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    toast.success(`${formatPrice(amountInPaise)} received. Hand the vehicle over next.`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Collect {formatPrice(amountInPaise)}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Collect payment</DialogTitle>
          <DialogDescription>{formatPrice(amountInPaise)} due, including GST.</DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
        <RadioGroup
          value={method}
          onValueChange={(value) => setMethod(value as "online" | "cash")}
          aria-label="How the customer pays"
          className="grid grid-cols-2 gap-2"
        >
          {(
            [
              { value: "online", label: "Online", icon: Smartphone, hint: "UPI or payment link" },
              { value: "cash", label: "Cash", icon: Banknote, hint: "At the counter" },
            ] as const
          ).map(({ value, label, icon: Icon, hint }) => (
            <label
              key={value}
              htmlFor={`pay-${value}`}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 text-sm has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
            >
              <RadioGroupItem id={`pay-${value}`} value={value} className="mt-0.5" />
              <span className="flex flex-col">
                <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                  <Icon aria-hidden className="size-4 text-navy-700" />
                  {label}
                </span>
                <span className="text-xs text-gray-500">{hint}</span>
              </span>
            </label>
          ))}
        </RadioGroup>
        {method === "online" ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="payment-reference">UPI or payment reference</Label>
            <Input
              id="payment-reference"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              placeholder="e.g. 628104559812"
            />
            <p className="text-xs text-gray-500">Demo only: no payment link is sent.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cash-received">Cash received (₹)</Label>
            <Input
              id="cash-received"
              inputMode="decimal"
              value={cash}
              onChange={(event) => setCash(event.target.value.replace(/[^\d.]/g, ""))}
            />
            {cash && change >= 0 && (
              <p className="text-sm font-medium text-success-700">
                Give back {formatPrice(change)}
              </p>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <SubmitButton type="button" isPending={isSaving} onClick={collect}>
            Mark as paid
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
