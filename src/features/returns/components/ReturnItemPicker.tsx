"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import type { ReturnableLine } from "@/features/returns/types";
import { formatNumber, formatPrice } from "@/lib/format";

type ReturnItemPickerProps = {
  lines: ReturnableLine[];
  quantities: Record<string, number>;
  onChange: (productId: string, quantity: number) => void;
};

/** Every part on the order: tick it to return it, then say how many. */
export function ReturnItemPicker({ lines, quantities, onChange }: ReturnItemPickerProps) {
  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200">
      {lines.map((line) => {
        const id = `return-${line.productId}`;
        const quantity = quantities[line.productId] ?? 0;
        const isFullyReturned = line.returnable === 0;
        return (
          <li key={line.productId} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3">
            <Checkbox
              id={id}
              checked={quantity > 0}
              disabled={isFullyReturned}
              onCheckedChange={(checked) => onChange(line.productId, checked === true ? 1 : 0)}
            />
            <label htmlFor={id} className="flex min-w-0 flex-1 flex-col gap-0.5 text-sm">
              <span className="font-medium text-gray-900">{line.name}</span>
              <span className="text-xs text-gray-500">
                {line.partNumber} · {formatPrice(line.unitPriceInPaise)} each, excl. GST ·{" "}
                {isFullyReturned
                  ? "already returned"
                  : `${formatNumber(line.returnable)} of ${formatNumber(line.quantity)} can be returned`}
              </span>
            </label>
            {quantity > 0 && (
              <QuantityStepper
                label={`Quantity of ${line.name} to return`}
                value={quantity}
                max={line.returnable}
                onChange={(next) => onChange(line.productId, next)}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
