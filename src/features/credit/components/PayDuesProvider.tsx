"use client";

import { createContext, use, useState, type ReactNode } from "react";

import { PayDuesDialog } from "@/features/credit/components/PayDuesDialog";
import type { Invoice } from "@/features/credit/types";

type PayDuesContextValue = {
  /** Opens the pay dialog with these invoices ticked. */
  openPayment: (invoiceIds: string[]) => void;
};

const PayDuesContext = createContext<PayDuesContextValue | null>(null);

/** One pay dialog for the page; any "Pay" button opens it with its own invoices ticked. */
export function PayDuesProvider({
  invoices,
  children,
}: {
  invoices: Invoice[];
  children: ReactNode;
}) {
  const [selected, setSelected] = useState<string[] | null>(null);

  return (
    <PayDuesContext value={{ openPayment: setSelected }}>
      {children}
      {selected && (
        <PayDuesDialog
          // A reported bank transfer is still being checked, so it can't be paid again yet.
          invoices={invoices.filter((invoice) => invoice.awaitingConfirmationInPaise === 0)}
          initialSelection={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </PayDuesContext>
  );
}

export function usePayDues(): PayDuesContextValue {
  const context = use(PayDuesContext);
  if (!context) throw new Error("usePayDues must be used inside PayDuesProvider");
  return context;
}
