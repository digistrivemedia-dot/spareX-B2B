"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { BranchOptions } from "@/features/checkout/components/BranchOptions";
import { useSelectedBranch } from "@/features/company/use-selected-branch";
import { OrderLineList } from "@/features/quick-order/components/OrderLineList";
import type { OrderLineDraft } from "@/features/quick-order/types";
import { useCheckedLines } from "@/features/quick-order/use-checked-lines";
import { useOrderLines } from "@/features/quick-order/use-order-lines";
import { requestQuotationAction } from "@/features/quotations/actions";
import { requestQuotationSchema, type RequestQuotationValues } from "@/features/quotations/schemas";
import { formatCount } from "@/lib/format";

type RequestQuotationFormProps = {
  /** Parts passed in from the cart or a quick order. */
  initialLines: Omit<OrderLineDraft, "id">[];
};

/** Parts and quantities (the same rows as Quick order), a delivery branch and notes. */
export function RequestQuotationForm({ initialLines }: RequestQuotationFormProps) {
  const router = useRouter();
  const branch = useSelectedBranch();
  const lines = useOrderLines(initialLines);
  const checkedLines = useCheckedLines(lines.lines);
  const form = useForm<RequestQuotationValues>({
    resolver: zodResolver(requestQuotationSchema),
    defaultValues: { notes: "" },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  // Out-of-stock parts are welcome here: quoting for them is often the point.
  const items = lines.lines.flatMap((line) =>
    line.product ? [{ productId: line.product.id, quantity: line.quantity }] : [],
  );

  async function onSubmit({ notes }: RequestQuotationValues) {
    if (items.length === 0 || !branch) {
      return form.setError("root", { message: "Add at least one part to quote for." });
    }
    const result = await requestQuotationAction({
      branchId: branch.id,
      notes: notes || undefined,
      items,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success(`${result.data.number} is ready`, {
      description: "Priced at your business prices and valid for 7 days.",
    });
    router.push(`/quotations/${result.data.id}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <Step title="1. Parts and quantities">
        <OrderLineList state={lines} checkedLines={checkedLines} />
      </Step>
      <Step title="2. Delivery branch">
        <BranchOptions />
      </Step>
      <Step title="3. Notes for Kannali">
        <Controller
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="quote-notes">Anything we should know? (optional)</FieldLabel>
              <Textarea
                {...field}
                id="quote-notes"
                rows={3}
                placeholder="e.g. Needed by the 20th for a service camp; target ₹370 per bottle."
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription>
                Deadlines, target prices, or alternatives you&apos;d accept.
              </FieldDescription>
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </Step>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <FormAlert message={errors.root?.message} />
        <SubmitButton size="lg" isPending={isSubmitting || isSubmitSuccessful}>
          Get quotation for {formatCount(items.length, "part")}
        </SubmitButton>
      </div>
    </form>
  );
}

function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
