"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
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

import { FieldGroup } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { VehicleTypeSelect } from "@/features/catalog/components/VehicleTypeSelect";
import { addCustomerAction } from "@/features/customers/actions";
import { newCustomerSchema, type NewCustomerValues } from "@/features/customers/schemas";
import { formatPlate } from "@/features/customers/utils";
import { toMobileDigits } from "@/lib/input-format";

const EMPTY: NewCustomerValues = {
  name: "",
  phone: "",
  email: "",
  plate: "",
  type: "two_wheeler",
  make: "",
  model: "",
};

/** Adds a customer (and, if known, their vehicle) before they first come in. */
export function AddCustomerDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<NewCustomerValues>({
    resolver: zodResolver(newCustomerSchema),
    defaultValues: EMPTY,
  });

  async function onSubmit(values: NewCustomerValues) {
    const result = await addCustomerAction({
      name: values.name,
      phone: `+91${values.phone}`,
      email: values.email || undefined,
      vehicle: values.plate
        ? {
            plate: formatPlate(values.plate),
            type: values.type,
            make: values.make,
            model: values.model,
          }
        : undefined,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    setIsOpen(false);
    form.reset(EMPTY);
    toast.success(`${values.name} added`);
    router.push(`/garage/customers/${result.data.id}`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus aria-hidden />
          Add customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-lg">
        {/* max-h keeps the whole form scrollable on short phone screens. */}
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <DialogHeader className="mb-4">
            <DialogTitle>Add customer</DialogTitle>
            <DialogDescription>
              The vehicle is optional; add it now if you know it.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <FormAlert message={form.formState.errors.root?.message} />
            <FormTextField control={form.control} name="name" label="Name" />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormTextField
                control={form.control}
                name="phone"
                label="Mobile"
                type="tel"
                inputMode="numeric"
                prefixText="+91"
                normalize={toMobileDigits}
              />
              <FormTextField
                control={form.control}
                name="email"
                label="Email (optional)"
                type="email"
              />
            </div>
            <FormTextField
              control={form.control}
              name="plate"
              label="Number plate (optional)"
              placeholder="KA 01 AB 1234"
            />
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <VehicleTypeSelect
                  id="new-customer-type"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <FormTextField
                control={form.control}
                name="make"
                label="Make"
                placeholder="e.g. Honda"
              />
              <FormTextField
                control={form.control}
                name="model"
                label="Model"
                placeholder="e.g. Activa 6G"
              />
            </div>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <SubmitButton isPending={form.formState.isSubmitting}>Add customer</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
