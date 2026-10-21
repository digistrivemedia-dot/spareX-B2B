"use client";

import { ReceiptText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/ui/SubmitButton";
import { createInvoiceAction } from "@/features/job-cards/actions";

/** Raises the invoice from the preview; the job then waits for payment. */
export function CreateInvoiceButton({ jobId }: { jobId: string }) {
  const [isSaving, setIsSaving] = useState(false);

  async function create() {
    setIsSaving(true);
    const result = await createInvoiceAction(jobId);
    setIsSaving(false);
    if (result.ok) toast.success("Invoice created. Collect the payment next.");
    else toast.error(result.message);
  }

  return (
    <SubmitButton type="button" size="lg" isPending={isSaving} onClick={create}>
      <ReceiptText aria-hidden />
      Create invoice
    </SubmitButton>
  );
}
