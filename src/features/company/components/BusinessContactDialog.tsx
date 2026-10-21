"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
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
import { FieldGroup } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { updateBusinessContactAction } from "@/features/company/actions";
import { businessContactSchema, type BusinessContactValues } from "@/features/company/schemas";
import type { Business } from "@/features/company/types";
import { toMobileDigits } from "@/lib/input-format";

type BusinessContactDialogProps = {
  business: Pick<Business, "email" | "phone">;
  trigger: ReactNode;
};

export function BusinessContactDialog({ business, trigger }: BusinessContactDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<BusinessContactValues>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: { email: business.email, phone: business.phone.replace(/^\+91/, "") },
  });

  async function onSubmit({ email, phone }: BusinessContactValues) {
    const result = await updateBusinessContactAction({ email, phone: `+91${phone}` });
    if (!result.ok) return form.setError("root", { message: result.message });
    setIsOpen(false);
    toast.success("Contact details saved");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <DialogHeader className="mb-4">
            <DialogTitle>Edit contact details</DialogTitle>
            <DialogDescription>
              Kannali sends order updates, invoices and statements here.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <FormTextField
              control={form.control}
              name="email"
              label="Business email"
              type="email"
            />
            <FormTextField
              control={form.control}
              name="phone"
              label="Phone"
              type="tel"
              inputMode="numeric"
              prefixText="+91"
              normalize={toMobileDigits}
            />
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton isPending={form.formState.isSubmitting}>Save</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
