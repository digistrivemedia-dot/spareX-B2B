"use client";

import { Button } from "@/components/ui/button";
import { usePayDues } from "@/features/credit/components/PayDuesProvider";
import type { Invoice } from "@/features/credit/types";

/** Opens the pay dialog with this invoice ticked; shows a note while a transfer is being checked. */
export function PayInvoiceButton({ invoice }: { invoice: Invoice }) {
  const { openPayment } = usePayDues();

  if (invoice.awaitingConfirmationInPaise > 0) {
    return <span className="text-xs font-medium text-info-700">Transfer being checked</span>;
  }
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => openPayment([invoice.id])}
      aria-label={`Pay ${invoice.number}`}
    >
      Pay
    </Button>
  );
}
