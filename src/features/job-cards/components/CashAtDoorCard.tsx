"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/SectionCard";
import { formatPrice } from "@/lib/format";

type CashAtDoorCardProps = {
  dueInPaise: number;
  /** Rupees, as typed. */
  value: string;
  onChange: (value: string) => void;
};

/** A delivered vehicle whose bill wasn't paid online: the driver collects it in cash. */
export function CashAtDoorCard({ dueInPaise, value, onChange }: CashAtDoorCardProps) {
  const changeInPaise = Math.round(Number(value || 0) * 100) - dueInPaise;

  return (
    <SectionCard title="Payment at the door">
      <div className="flex flex-col gap-1.5 sm:w-72">
        <p className="mb-2 text-sm text-gray-700">
          The bill isn&apos;t paid yet. Collect{" "}
          <strong className="tabular-nums">{formatPrice(dueInPaise)}</strong> incl. GST in cash.
        </p>
        <Label htmlFor="cash-at-door">Cash received (₹)</Label>
        <Input
          id="cash-at-door"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, ""))}
        />
        {value && changeInPaise >= 0 && (
          <p className="text-sm font-medium text-success-700">
            Give back {formatPrice(changeInPaise)}
          </p>
        )}
      </div>
    </SectionCard>
  );
}
