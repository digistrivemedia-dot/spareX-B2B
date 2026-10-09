"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

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
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import type { CommentValues } from "@/features/quotations/schemas";
import type { ActionResult } from "@/lib/types";

type CommentDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  successMessage: string;
  schema: z.ZodType<CommentValues, CommentValues>;
  onSubmit: (comment: string) => Promise<ActionResult<null>>;
  /** Styles the confirm button as destructive, e.g. for rejecting. */
  isDestructive?: boolean;
};

/** A confirm dialog with a comment box: used to ask for a revision or to reject. */
export function CommentDialog({
  trigger,
  title,
  description,
  label,
  placeholder,
  submitLabel,
  successMessage,
  schema,
  onSubmit,
  isDestructive,
}: CommentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CommentValues>({
    resolver: zodResolver(schema),
    defaultValues: { comment: "" },
  });

  async function handleSubmit({ comment }: CommentValues) {
    const result = await onSubmit(comment);
    if (!result.ok) return form.setError("root", { message: result.message });
    setIsOpen(false);
    form.reset();
    toast.success(successMessage);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} noValidate className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FormAlert message={form.formState.errors.root?.message} />
          <Controller
            control={form.control}
            name="comment"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="decision-comment">{label}</FieldLabel>
                <Textarea
                  {...field}
                  id="decision-comment"
                  rows={4}
                  placeholder={placeholder}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton
              isPending={form.formState.isSubmitting}
              variant={isDestructive ? "destructive" : "default"}
            >
              {submitLabel}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
