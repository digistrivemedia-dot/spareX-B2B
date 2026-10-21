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
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { ActionResult } from "@/lib/types";

type ConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  successMessage: string;
  onConfirm: () => Promise<ActionResult<unknown>>;
  /** Styles the confirm button as destructive, e.g. for removing something. */
  isDestructive?: boolean;
};

/** Asks "are you sure?" before an action, then shows a toast or the error. */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  successMessage,
  onConfirm,
  isDestructive,
}: ConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>();

  async function handleConfirm() {
    setIsPending(true);
    const result = await onConfirm();
    setIsPending(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    toast.success(successMessage);
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        setError(undefined);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
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
