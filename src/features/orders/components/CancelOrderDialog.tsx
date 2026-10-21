"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Ban } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { cancelOrderAction } from "@/features/orders/actions";
import { cancelOrderSchema, type CancelOrderValues } from "@/features/orders/schemas";
import type { Order } from "@/features/orders/types";
import { CANCELLATION_REASON_LABELS } from "@/features/orders/utils";

/** Asks why, confirms, then cancels an order that hasn't shipped. */
export function CancelOrderDialog({ order }: { order: Pick<Order, "id" | "number" | "payment"> }) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CancelOrderValues>({
    resolver: zodResolver(cancelOrderSchema),
    defaultValues: { note: "" },
  });
  const isPaid = order.payment.status === "paid";

  async function onSubmit({ reason, note }: CancelOrderValues) {
    const result = await cancelOrderAction(order.id, { reason, note: note || undefined });
    if (!result.ok) return form.setError("root", { message: result.message });
    setIsOpen(false);
    toast.success(`${order.number} cancelled`, {
      description: isPaid ? "Your payment will be refunded in 5–7 working days." : undefined,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-danger-700 hover:text-danger-700">
          <Ban aria-hidden />
          Cancel order
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Cancel {order.number}?</DialogTitle>
            <DialogDescription>
              {isPaid
                ? "The whole order is cancelled and your payment is refunded to the way you paid, in 5–7 working days."
                : "The whole order is cancelled. This can't be undone."}
            </DialogDescription>
          </DialogHeader>
          <FormAlert message={form.formState.errors.root?.message} />
          <Controller
            control={form.control}
            name="reason"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cancel-reason">Reason</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="cancel-reason"
                    className="w-full"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Choose a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CANCELLATION_REASON_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="note"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="cancel-note">Note for Kannali (optional)</FieldLabel>
                <Textarea {...field} id="cancel-note" rows={3} aria-invalid={fieldState.invalid} />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Keep order
            </Button>
            <SubmitButton isPending={form.formState.isSubmitting} variant="destructive">
              Cancel order
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
