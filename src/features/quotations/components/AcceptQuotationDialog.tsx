"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

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
import { FormTextField } from "@/components/ui/FormTextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { acceptQuotationAction } from "@/features/quotations/actions";
import { acceptQuotationSchema, type AcceptQuotationValues } from "@/features/quotations/schemas";
import { formatPrice } from "@/lib/format";

type AcceptQuotationDialogProps = {
  quotationId: string;
  totalInPaise: number;
  branchName: string;
  termsDays: number;
};

/** Accepting places the order straight away: on credit, at the quoted prices. */
export function AcceptQuotationDialog({
  quotationId,
  totalInPaise,
  branchName,
  termsDays,
}: AcceptQuotationDialogProps) {
  const router = useRouter();
  const form = useForm<AcceptQuotationValues>({
    resolver: zodResolver(acceptQuotationSchema),
    defaultValues: { poNumber: "" },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  async function onSubmit({ poNumber }: AcceptQuotationValues) {
    const result = await acceptQuotationAction(quotationId, { poNumber: poNumber || undefined });
    if (result.ok) router.push(`/checkout/success?order=${result.data.id}`);
    else form.setError("root", { message: result.message });
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg">
          <CircleCheck aria-hidden />
          Accept & convert to order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Accept and place the order?</DialogTitle>
            <DialogDescription>
              We&apos;ll place an order for {formatPrice(totalInPaise)} (incl. GST) at the quoted
              prices, on credit (Net {termsDays}), delivered to {branchName}.
            </DialogDescription>
          </DialogHeader>
          <FormAlert message={errors.root?.message} />
          <FormTextField
            control={form.control}
            name="poNumber"
            label="Your PO number (optional)"
            placeholder="e.g. PO/SSW/2026/043"
            description="Printed on the GST invoice."
          />
          <DialogFooter>
            <SubmitButton isPending={isSubmitting || isSubmitSuccessful}>
              Accept and place order
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
