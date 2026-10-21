"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { createReturnAction } from "@/features/returns/actions";
import { RefundSummary } from "@/features/returns/components/RefundSummary";
import { ReturnItemPicker } from "@/features/returns/components/ReturnItemPicker";
import { ReturnReasonField } from "@/features/returns/components/ReturnReasonField";
import { returnSchema, type ReturnValues } from "@/features/returns/schemas";
import type { RefundMethod, ReturnableLine } from "@/features/returns/types";
import { MAX_RETURN_PHOTOS } from "@/features/returns/utils";
import { summarisePricing } from "@/lib/pricing";

type ReturnFormProps = {
  orderId: string;
  lines: ReturnableLine[];
  refundMethod: RefundMethod;
};

export function ReturnForm({ orderId, lines, refundMethod }: ReturnFormProps) {
  const router = useRouter();
  const form = useForm<ReturnValues>({
    resolver: zodResolver(returnSchema),
    defaultValues: { quantities: {}, notes: "", photos: [] },
  });
  const quantities = useWatch({ control: form.control, name: "quantities" });
  const { subtotalInPaise, gstInPaise } = summarisePricing(
    lines.map((line) => ({
      ...line,
      quantity: quantities[line.productId] ?? 0,
      listPriceInPaise: line.unitPriceInPaise,
    })),
  );

  async function onSubmit({ quantities: chosen, reason, notes, photos }: ReturnValues) {
    const items = Object.entries(chosen)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({ productId, quantity }));
    const result = await createReturnAction({
      orderId,
      reason,
      notes: notes || undefined,
      photos,
      items,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success(`Return ${result.data.number} requested`, {
      description: "Kannali will review it within a working day.",
    });
    router.push(`/returns/${result.data.id}`);
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-6 xl:flex-row xl:items-start"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <SectionCard title="1. Parts to return">
          <Controller
            control={form.control}
            name="quantities"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <ReturnItemPicker
                  lines={lines}
                  quantities={field.value}
                  onChange={(productId, quantity) =>
                    field.onChange({ ...field.value, [productId]: quantity })
                  }
                />
                <FieldError errors={[fieldState.error]} />
              </div>
            )}
          />
        </SectionCard>
        <SectionCard title="2. Reason">
          <ReturnReasonField control={form.control} />
        </SectionCard>
        <SectionCard title="3. Photos and notes">
          <div className="flex flex-col gap-5">
            <Controller
              control={form.control}
              name="photos"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="return-photos">Photos</FieldLabel>
                  <FieldDescription id="return-photos-description">
                    Required for damaged or defective parts. Up to {MAX_RETURN_PHOTOS}.
                  </FieldDescription>
                  <PhotoUpload
                    id="return-photos"
                    value={field.value}
                    onChange={field.onChange}
                    max={MAX_RETURN_PHOTOS}
                    label="Return photo"
                    isInvalid={fieldState.invalid}
                    describedBy="return-photos-description"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="notes"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="return-notes">Notes for Kannali (optional)</FieldLabel>
                  <Textarea
                    {...field}
                    id="return-notes"
                    rows={3}
                    placeholder="e.g. Box was crushed; one pad is cracked."
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </SectionCard>
      </div>

      <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
        <RefundSummary refundInPaise={subtotalInPaise + gstInPaise} refundMethod={refundMethod}>
          <FormAlert message={form.formState.errors.root?.message} />
          <SubmitButton size="lg" isPending={form.formState.isSubmitting}>
            Request return
          </SubmitButton>
        </RefundSummary>
      </aside>
    </form>
  );
}
