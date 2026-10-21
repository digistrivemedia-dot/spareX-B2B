"use client";

import { useState, type ReactNode } from "react";
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
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import type { ActionResult } from "@/lib/types";

const MIN_LENGTH = 3;
const MAX_LENGTH = 300;

type ReasonDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  label: string;
  placeholder?: string;
  confirmLabel: string;
  successMessage: string;
  onConfirm: (reason: string) => Promise<ActionResult<unknown>>;
  isDestructive?: boolean;
};

/** Confirms an action that needs a short written reason, e.g. declining a booking. */
export function ReasonDialog({
  trigger,
  title,
  description,
  label,
  placeholder,
  confirmLabel,
  successMessage,
  onConfirm,
  isDestructive,
}: ReasonDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [error, setError] = useState<string>();
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    const trimmed = reason.trim();
    if (trimmed.length < MIN_LENGTH) return setFieldError("Please give a short reason");
    if (trimmed.length > MAX_LENGTH) return setFieldError(`Keep it to ${MAX_LENGTH} characters`);
    setIsPending(true);
    const result = await onConfirm(trimmed);
    setIsPending(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    setReason("");
    toast.success(successMessage);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setError(undefined);
        setFieldError(undefined);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
        <Field data-invalid={Boolean(fieldError)}>
          <FieldLabel htmlFor="reason-dialog-text">{label}</FieldLabel>
          <Textarea
            id="reason-dialog-text"
            rows={3}
            value={reason}
            placeholder={placeholder}
            onChange={(event) => {
              setReason(event.target.value);
              setFieldError(undefined);
            }}
            aria-invalid={Boolean(fieldError)}
          />
          <FieldError>{fieldError}</FieldError>
        </Field>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <SubmitButton
            type="button"
            isPending={isPending}
            onClick={handleConfirm}
            variant={isDestructive ? "destructive" : "default"}
          >
            {confirmLabel}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
