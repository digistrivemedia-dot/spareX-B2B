"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { updateGarageProfileAction } from "@/features/garage/actions";
import { HolidaysField } from "@/features/garage/components/HolidaysField";
import { OpeningHoursField } from "@/features/garage/components/OpeningHoursField";
import { ServicesField } from "@/features/garage/components/ServicesField";
import { VehicleTypesField } from "@/features/garage/components/VehicleTypesField";
import {
  garageProfileSchema,
  MAX_GARAGE_PHOTOS,
  type GarageProfileValues,
} from "@/features/garage/schemas";
import type { GarageProfile } from "@/features/garage/types";
import { toGarageProfile, toProfileValues } from "@/features/garage/utils";

/** Everything customers see when they book: one form, saved together. */
export function GarageProfileForm({ profile }: { profile: GarageProfile }) {
  const form = useForm<GarageProfileValues>({
    resolver: zodResolver(garageProfileSchema),
    defaultValues: toProfileValues(profile),
  });
  const { control, formState } = form;

  async function onSubmit(values: GarageProfileValues) {
    const result = await updateGarageProfileAction(toGarageProfile(values));
    if (!result.ok) return form.setError("root", { message: result.message });
    form.reset(values);
    toast.success("Garage profile saved");
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <FormAlert message={formState.errors.root?.message} />
        <SectionCard title="Photos and about">
          <div className="flex flex-col gap-5">
            <Controller
              control={control}
              name="photos"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="garage-photos">Photos</FieldLabel>
                  <FieldDescription id="garage-photos-description">
                    Up to {MAX_GARAGE_PHOTOS}. The first one is shown first to customers.
                  </FieldDescription>
                  <PhotoUpload
                    id="garage-photos"
                    value={field.value}
                    onChange={field.onChange}
                    max={MAX_GARAGE_PHOTOS}
                    label="Garage photo"
                    isInvalid={fieldState.invalid}
                    describedBy="garage-photos-description"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              control={control}
              name="about"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="garage-about">About your garage</FieldLabel>
                  <Textarea
                    {...field}
                    id="garage-about"
                    rows={4}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </div>
        </SectionCard>
        <SectionCard title="Services and prices">
          <ServicesField />
        </SectionCard>
        <SectionCard title="Vehicle types you service">
          <VehicleTypesField />
        </SectionCard>
        <SectionCard title="Opening hours">
          <div className="flex flex-col gap-5">
            <OpeningHoursField />
            <div className="sm:w-80">
              <FormTextField
                control={control}
                name="dailyBookingLimit"
                label="Bookings per branch per day"
                inputMode="numeric"
                description="Customers can't book once a branch has this many for the day."
              />
            </div>
          </div>
        </SectionCard>
        <SectionCard title="Holidays">
          <HolidaysField />
        </SectionCard>
        {/* Sticky so the save button is always in reach on a long form. */}
        <div className="sticky bottom-0 -mx-4 flex justify-end border-t border-gray-200 bg-white px-4 py-3 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8">
          <SubmitButton isPending={formState.isSubmitting} disabled={!formState.isDirty}>
            Save changes
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
