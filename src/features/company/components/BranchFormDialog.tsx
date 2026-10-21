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
import { saveBranchAction } from "@/features/company/actions";
import { branchSchema, type BranchValues } from "@/features/company/schemas";
import type { Branch } from "@/features/company/types";
import { usePincodeLookup } from "@/features/company/use-pincode-lookup";
import { toMobileDigits, toPinDigits } from "@/lib/input-format";

const EMPTY: BranchValues = {
  name: "",
  line1: "",
  line2: "",
  pin: "",
  city: "",
  state: "",
  contactName: "",
  contactPhone: "",
};

function toValues(branch: Branch): BranchValues {
  const { address } = branch;
  return {
    name: branch.name,
    line1: address.line1,
    line2: address.line2 ?? "",
    pin: address.pin,
    city: address.city,
    state: address.state,
    contactName: branch.contactName,
    contactPhone: branch.contactPhone.replace(/^\+91/, ""),
  };
}

type BranchFormDialogProps = {
  trigger: ReactNode;
  /** Leave out to add a new branch. */
  branch?: Branch;
};

/** Adds or edits a branch: its name, delivery address and who receives deliveries there. */
export function BranchFormDialog({ trigger, branch }: BranchFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<BranchValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: branch ? toValues(branch) : EMPTY,
  });
  const pinLookup = usePincodeLookup(({ city, state }) => {
    form.setValue("city", city, { shouldValidate: true });
    form.setValue("state", state, { shouldValidate: true });
  });

  async function onSubmit(values: BranchValues) {
    const result = await saveBranchAction(branch?.id ?? null, {
      name: values.name,
      address: {
        line1: values.line1,
        line2: values.line2 || undefined,
        city: values.city,
        state: values.state,
        pin: values.pin,
      },
      contactName: values.contactName,
      contactPhone: `+91${values.contactPhone}`,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    setIsOpen(false);
    if (!branch) form.reset(EMPTY);
    toast.success(branch ? `${values.name} updated` : `${values.name} added`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {/* max-h keeps the whole form scrollable on short phone screens. */}
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <DialogHeader className="mb-4">
            <DialogTitle>{branch ? `Edit ${branch.name}` : "Add a branch"}</DialogTitle>
            <DialogDescription>Parts for this branch are delivered here.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <FormTextField control={form.control} name="name" label="Branch name" />
            <FormTextField control={form.control} name="line1" label="Building and street" />
            <FormTextField
              control={form.control}
              name="line2"
              label="Area or landmark (optional)"
            />
            <FormTextField
              control={form.control}
              name="pin"
              label="PIN code"
              inputMode="numeric"
              normalize={toPinDigits}
              onValueChange={pinLookup.lookUp}
              description={pinLookup.description}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormTextField control={form.control} name="city" label="City" />
              <FormTextField control={form.control} name="state" label="State" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormTextField control={form.control} name="contactName" label="Contact person" />
              <FormTextField
                control={form.control}
                name="contactPhone"
                label="Contact mobile"
                type="tel"
                inputMode="numeric"
                prefixText="+91"
                normalize={toMobileDigits}
              />
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton isPending={form.formState.isSubmitting}>
              {branch ? "Save changes" : "Add branch"}
            </SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
