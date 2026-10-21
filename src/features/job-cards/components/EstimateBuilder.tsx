"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormAlert } from "@/components/ui/FormAlert";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { GarageService } from "@/features/garage/types";
import { sendEstimateAction, sendRevisionAction } from "@/features/job-cards/actions";
import { EstimateEditor } from "@/features/job-cards/components/EstimateEditor";
import { estimateSchema, type EstimateValues } from "@/features/job-cards/schemas";
import type { JobCard } from "@/features/job-cards/types";
import { newEstimateLine, toLineInput } from "@/features/job-cards/utils";

/** The first estimate starts with a line for every inspection item that needs work. */
function startingLines(job: JobCard): EstimateValues["lines"] {
  const flagged = job.inspection?.items.filter((item) => item.result !== "ok") ?? [];
  return flagged.map((item) => ({
    ...newEstimateLine(item.result === "replace" ? "part" : "labour"),
    id: `${job.id}-from-${item.id}`,
    description: item.result === "replace" ? "" : `${item.name}: ${item.note ?? "check and fix"}`,
  }));
}

type EstimateBuilderProps = {
  job: JobCard;
  services: GarageService[];
  /** "revision" adds extra work to an estimate the customer already approved. */
  mode: "first" | "revision";
};

export function EstimateBuilder({ job, services, mode }: EstimateBuilderProps) {
  const router = useRouter();
  const form = useForm<EstimateValues>({
    resolver: zodResolver(estimateSchema),
    defaultValues: { lines: mode === "first" ? startingLines(job) : [newEstimateLine("labour")] },
  });

  async function onSubmit({ lines }: EstimateValues) {
    const send = mode === "first" ? sendEstimateAction : sendRevisionAction;
    const result = await send(job.id, { lines: lines.map(toLineInput) });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success(
      mode === "first" ? "Estimate sent to the customer" : "Extra work sent for approval",
      { description: "Record their answer on the estimate when they reply." },
    );
    router.push(`/garage/jobs/${job.id}/estimate`);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <FormAlert message={form.formState.errors.root?.message} />
        <SectionCard title={mode === "first" ? "Estimate" : "Extra work"}>
          <EstimateEditor services={services} />
        </SectionCard>
        <SubmitButton size="lg" isPending={form.formState.isSubmitting} className="self-end">
          <Send aria-hidden />
          {mode === "first" ? "Send to customer" : "Send extra work for approval"}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
