"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FieldGroup } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { Branch } from "@/features/company/types";
import type { VehicleLookup } from "@/features/customers/api";
import { formatPlate } from "@/features/customers/utils";
import { createWalkInAction, findVehicleByPlateAction } from "@/features/job-cards/actions";
import { ComplaintsField } from "@/features/job-cards/components/ComplaintsField";
import { NewVehicleFields } from "@/features/job-cards/components/NewVehicleFields";
import { PlateLookup } from "@/features/job-cards/components/PlateLookup";
import { walkInSchema, type WalkInValues } from "@/features/job-cards/schemas";

type WalkInFormProps = {
  branches: Branch[];
  /** The branch the job opens at; owners can change it. */
  defaultBranchId: string;
  canChooseBranch: boolean;
};

/** Find the vehicle by its plate (or add it), note the complaints, then go on to check-in. */
export function WalkInForm({ branches, defaultBranchId, canChooseBranch }: WalkInFormProps) {
  const router = useRouter();
  const [lookup, setLookup] = useState<VehicleLookup | "not_found" | null>(null);
  const form = useForm<WalkInValues>({
    resolver: zodResolver(walkInSchema),
    defaultValues: {
      branchId: defaultBranchId,
      plate: "",
      vehicleId: "",
      type: "two_wheeler",
      make: "",
      model: "",
      customerName: "",
      customerPhone: "",
      complaints: [{ text: "" }],
    },
  });

  async function findVehicle() {
    if (!(await form.trigger("plate"))) return;
    const plate = formatPlate(form.getValues("plate"));
    form.setValue("plate", plate);
    const result = await findVehicleByPlateAction(plate);
    if (!result.ok) return form.setError("root", { message: result.message });
    setLookup(result.data ?? "not_found");
    form.setValue("vehicleId", result.data?.vehicle.id ?? "");
  }

  function changePlate() {
    setLookup(null);
    form.setValue("vehicleId", "");
  }

  async function onSubmit(values: WalkInValues) {
    const result = await createWalkInAction({
      branchId: values.branchId,
      vehicleId: values.vehicleId || undefined,
      newVehicle: values.vehicleId
        ? undefined
        : {
            plate: formatPlate(values.plate),
            type: values.type,
            make: values.make,
            model: values.model,
            customer: { name: values.customerName, phone: `+91${values.customerPhone}` },
          },
      complaints: values.complaints.map((item) => item.text).filter(Boolean),
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success("Walk-in job opened. Now check the vehicle in.");
    router.push(`/garage/jobs/${result.data.jobId}/check-in`);
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="flex max-w-3xl flex-col gap-6"
      >
        <FormAlert message={form.formState.errors.root?.message} />
        <SectionCard title="1. Vehicle">
          <PlateLookup
            lookup={lookup}
            onFind={findVehicle}
            onChange={changePlate}
            branches={canChooseBranch ? branches : undefined}
          />
          {lookup === "not_found" && <NewVehicleFields />}
        </SectionCard>
        {lookup && (
          <>
            <SectionCard title="2. What needs doing">
              <FieldGroup>
                <ComplaintsField />
              </FieldGroup>
            </SectionCard>
            <SubmitButton size="lg" isPending={form.formState.isSubmitting} className="self-end">
              Open job and check in
            </SubmitButton>
          </>
        )}
      </form>
    </FormProvider>
  );
}
