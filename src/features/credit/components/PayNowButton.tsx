"use client";

import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePayDues } from "@/features/credit/components/PayDuesProvider";
import type { Invoice } from "@/features/credit/types";

/** Opens the pay dialog with the overdue invoices ticked, or every unpaid one if none is overdue. */
export function PayNowButton({ invoices }: { invoices: Invoice[] }) {
  const { openPayment } = usePayDues();
  const payable = invoices.filter((invoice) => invoice.awaitingConfirmationInPaise === 0);
  const overdue = payable.filter((invoice) => invoice.status === "overdue");

  return (
    <Button
      onClick={() => openPayment((overdue.length ? overdue : payable).map((invoice) => invoice.id))}
      disabled={payable.length === 0}
    >
      <Wallet aria-hidden />
      Pay now
    </Button>
  );
}
