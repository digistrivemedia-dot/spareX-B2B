"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Invoice } from "@/features/credit/types";
import { formatDate, formatPrice } from "@/lib/format";

type InvoicePickerProps = {
  invoices: Invoice[];
  value: string[];
  onChange: (invoiceIds: string[]) => void;
};

/** Unpaid invoices with a tick box each; the overdue ones come first. */
export function InvoicePicker({ invoices, value, onChange }: InvoicePickerProps) {
  const toggle = (id: string, checked: boolean) =>
    onChange(checked ? [...value, id] : value.filter((selected) => selected !== id));

  return (
    <ul className="max-h-64 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200">
      {invoices.map((invoice) => {
        const id = `pay-${invoice.id}`;
        return (
          <li key={invoice.id}>
            <label htmlFor={id} className="flex min-h-12 items-center gap-3 px-3 py-2 text-sm">
              <Checkbox
                id={id}
                checked={value.includes(invoice.id)}
                onCheckedChange={(checked) => toggle(invoice.id, checked === true)}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="font-medium text-gray-900">{invoice.number}</span>
                <span className="text-xs text-gray-500">Due {formatDate(invoice.dueDate)}</span>
              </span>
              {invoice.status === "overdue" && <StatusBadge status="overdue" />}
              <span className="font-semibold text-gray-900 tabular-nums">
                {formatPrice(invoice.balanceInPaise)}
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
