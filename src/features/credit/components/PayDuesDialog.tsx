"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { payInvoicesAction } from "@/features/credit/actions";
import { InvoicePicker } from "@/features/credit/components/InvoicePicker";
import { PayMethodFields } from "@/features/credit/components/PayMethodFields";
import { payDuesSchema, type PayDuesValues } from "@/features/credit/schemas";
import type { Invoice, PayInvoicesRequest } from "@/features/credit/types";
import { formatPrice } from "@/lib/format";

type PayDuesDialogProps = {
  invoices: Invoice[];
  initialSelection: string[];
  onClose: () => void;
};

/** Pick invoices, see the total, and pay online or report a bank transfer. */
export function PayDuesDialog({ invoices, initialSelection, onClose }: PayDuesDialogProps) {
  const form = useForm<PayDuesValues>({
    resolver: zodResolver(payDuesSchema),
    defaultValues: {
      invoiceIds: initialSelection,
      method: "razorpay",
      channel: "upi",
      transferReference: "",
    },
  });
  const [invoiceIds, method] = useWatch({ control: form.control, name: ["invoiceIds", "method"] });
  const totalInPaise = invoices
    .filter((invoice) => invoiceIds.includes(invoice.id))
    .reduce((sum, invoice) => sum + invoice.balanceInPaise, 0);

  async function onSubmit(values: PayDuesValues) {
    const payment: PayInvoicesRequest["payment"] =
      values.method === "razorpay"
        ? { method: "razorpay", channel: values.channel }
        : { method: "bank_transfer", transferReference: values.transferReference };
    const result = await payInvoicesAction({ invoiceIds: values.invoiceIds, payment });
    if (!result.ok) return form.setError("root", { message: result.message });
    onClose();
    if (result.data.isConfirmed) {
      toast.success(`${formatPrice(result.data.amountInPaise)} paid`, {
        description: "Your credit available has gone up.",
      });
    } else {
      toast.success("Bank transfer reported", {
        description: "Kannali will confirm it within a working day.",
      });
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle>Pay invoices</DialogTitle>
            <DialogDescription>
              Choose the invoices to pay and how you&apos;d like to pay.
            </DialogDescription>
          </DialogHeader>
          <FormAlert message={form.formState.errors.root?.message} />
          <Controller
            control={form.control}
            name="invoiceIds"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <InvoicePicker invoices={invoices} value={field.value} onChange={field.onChange} />
                <FieldError errors={[fieldState.error]} />
              </div>
            )}
          />
          <div className="flex items-baseline justify-between border-t border-gray-200 pt-4">
            <span className="text-sm font-medium text-gray-900">Total (incl. GST)</span>
            <span className="text-xl font-semibold text-gray-900 tabular-nums">
              {formatPrice(totalInPaise)}
            </span>
          </div>
          <PayMethodFields control={form.control} method={method} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <SubmitButton isPending={form.formState.isSubmitting} disabled={totalInPaise === 0}>
              {method === "razorpay"
                ? `Pay ${formatPrice(totalInPaise)}`
                : "I've made the transfer"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
