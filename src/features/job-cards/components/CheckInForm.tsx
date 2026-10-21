"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { checkInAction } from "@/features/job-cards/actions";
import { ComplaintsField } from "@/features/job-cards/components/ComplaintsField";
import { DamageNotesField } from "@/features/job-cards/components/DamageNotesField";
import { FuelLevelField } from "@/features/job-cards/components/FuelLevelField";
import { checkInSchema, type CheckInValues } from "@/features/job-cards/schemas";
import type { JobCard } from "@/features/job-cards/types";

const MAX_VEHICLE_PHOTOS = 8;

/** Records how the vehicle arrived. Saving opens the job card for inspection. */
export function CheckInForm({ job }: { job: JobCard }) {
  const router = useRouter();
  const form = useForm<CheckInValues>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      odometerKm: "",
      fuelLevel: "half",
      complaints: job.complaints.map((text) => ({ text })),
      damages: [],
      photos: [],
    },
  });

  async function onSubmit(values: CheckInValues) {
    const result = await checkInAction(job.id, {
      odometerKm: Number(values.odometerKm),
      fuelLevel: values.fuelLevel,
      complaints: values.complaints.map((item) => item.text).filter(Boolean),
      damages: values.damages,
      photos: values.photos,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success(`${job.vehicle.plate} checked in. The job card is open.`);
    router.push(`/garage/jobs/${job.id}`);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-3xl flex-col gap-6"
      >
        <FormAlert message={form.formState.errors.root?.message} />
        <SectionCard title="Reading and fuel">
          <FieldGroup>
            <div className="sm:w-64">
              <FormTextField
                control={form.control}
                name="odometerKm"
                label="Odometer (km)"
                inputMode="numeric"
                autoFocus
              />
            </div>
            <FuelLevelField />
          </FieldGroup>
        </SectionCard>
        <SectionCard title="Complaints">
          <ComplaintsField />
        </SectionCard>
        <SectionCard title="Damage on arrival">
          <DamageNotesField />
        </SectionCard>
        <SectionCard title="Vehicle photos">
          <Controller
            control={form.control}
            name="photos"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="check-in-photos" className="sr-only">
                  Vehicle photos
                </FieldLabel>
                <FieldDescription id="check-in-photos-description">
                  Front, back, both sides and the odometer. Up to {MAX_VEHICLE_PHOTOS}.
                </FieldDescription>
                <PhotoUpload
                  id="check-in-photos"
                  value={field.value}
                  onChange={field.onChange}
                  max={MAX_VEHICLE_PHOTOS}
                  label="Vehicle photo"
                  describedBy="check-in-photos-description"
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </SectionCard>
        {/* Sticky so check-in can be saved from anywhere on a phone. */}
        <div className="sticky bottom-0 -mx-4 border-t border-gray-200 bg-white px-4 py-3 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0">
          <SubmitButton
            size="lg"
            isPending={form.formState.isSubmitting}
            className="w-full md:w-auto"
          >
            Save check-in
          </SubmitButton>
        </div>
      </form>
    </FormProvider>
  );
}
