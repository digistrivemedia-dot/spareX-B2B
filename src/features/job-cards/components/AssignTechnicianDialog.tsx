"use client";

import { UserCog } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmitButton } from "@/components/ui/SubmitButton";
import type { TechnicianLoad } from "@/features/job-cards/api";
import { assignTechnicianAction, getTechnicianLoadAction } from "@/features/job-cards/actions";
import type { JobCard } from "@/features/job-cards/types";
import { formatCount } from "@/lib/format";

type AssignTechnicianDialogProps = {
  job: Pick<JobCard, "id" | "branch" | "technician">;
  trigger?: ReactNode;
};

/** Pick a technician at the job's branch, seeing how busy each one is. */
export function AssignTechnicianDialog({ job, trigger }: AssignTechnicianDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [technicians, setTechnicians] = useState<TechnicianLoad[] | null>(null);
  const [selected, setSelected] = useState(job.technician?.id ?? "");
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function open(next: boolean) {
    setIsOpen(next);
    setError(undefined);
    if (!next) return;
    const result = await getTechnicianLoadAction(job.branch.id);
    if (result.ok) setTechnicians(result.data);
    else setError(result.message);
  }

  async function assign() {
    if (!selected) return setError("Choose a technician.");
    setIsSaving(true);
    const result = await assignTechnicianAction(job.id, selected);
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    setIsOpen(false);
    const name = technicians?.find((technician) => technician.id === selected)?.name;
    toast.success(`Assigned to ${name}. They'll accept it in My jobs.`);
  }

  return (
    <Dialog open={isOpen} onOpenChange={open}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="lg">
            <UserCog aria-hidden />
            {job.technician ? "Reassign technician" : "Assign technician"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{job.technician ? "Reassign technician" : "Assign technician"}</DialogTitle>
          <DialogDescription>
            Technicians at {job.branch.name}, with how many jobs each has on now.
          </DialogDescription>
        </DialogHeader>
        <FormAlert message={error} />
        {technicians === null ? (
          <div className="flex flex-col gap-2" aria-busy="true" aria-label="Loading technicians">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : technicians.length === 0 ? (
          <p className="text-sm text-gray-500">
            No technicians work at this branch yet. Add one in Company › Users.
          </p>
        ) : (
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            aria-label="Technician"
            className="flex flex-col gap-2"
          >
            {technicians.map((technician) => (
              <label
                key={technician.id}
                htmlFor={`tech-${technician.id}`}
                className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-gray-200 px-3 text-sm has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
              >
                <RadioGroupItem id={`tech-${technician.id}`} value={technician.id} />
                <span className="flex-1 font-medium text-gray-900">{technician.name}</span>
                <span className="text-gray-500">
                  {formatCount(technician.activeJobs, "job")} on now
                </span>
              </label>
            ))}
          </RadioGroup>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <SubmitButton type="button" isPending={isSaving} onClick={assign}>
            Assign
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
