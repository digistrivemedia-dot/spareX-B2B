"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Checklist } from "@/components/ui/Checklist";
import { FormAlert } from "@/components/ui/FormAlert";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { SectionCard } from "@/components/ui/SectionCard";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { handOverAction } from "@/features/job-cards/actions";
import { CashAtDoorCard } from "@/features/job-cards/components/CashAtDoorCard";
import { ReadingField } from "@/features/job-cards/components/ReadingField";
import type { JobCard } from "@/features/job-cards/types";
import { indiaDateFromToday } from "@/lib/dates";

const CHECKLIST = [
  "Vehicle returned to the customer",
  "Old parts shown or handed back",
  "Belongings in the vehicle returned",
  "Invoice and completion report shared",
];

/** Suggested next service: in 3 months or 3,000 km, whichever comes first. */
const NEXT_SERVICE_DAYS = 90;
const NEXT_SERVICE_KM = 3000;
const MAX_PHOTOS = 4;

type HandoverFormProps = {
  job: JobCard;
  /** Where to go once done: the completion report, or a driver's trips. */
  doneHref: string;
};

export function HandoverForm({ job, doneHref }: HandoverFormProps) {
  const router = useRouter();
  const cashDueInPaise =
    job.status === "out_for_delivery" && !job.payment ? job.invoice?.totalInPaise : undefined;
  const [cash, setCash] = useState("");
  const startKm = job.checkIn?.odometerKm ?? 0;
  const [checklist, setChecklist] = useState(CHECKLIST.map((label) => ({ label, isDone: false })));
  const [odometer, setOdometer] = useState(String(startKm));
  const [nextDate, setNextDate] = useState(() => indiaDateFromToday(NEXT_SERVICE_DAYS));
  const [nextKm, setNextKm] = useState(String(startKm + NEXT_SERVICE_KM));
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const allDone = checklist.every((item) => item.isDone);

  async function complete() {
    if (!allDone) return setError("Tick every handover step first.");
    setIsSaving(true);
    const result = await handOverAction(job.id, {
      checklist,
      odometerKm: Number(odometer),
      cashAtDoorInPaise: cashDueInPaise ? Math.round(Number(cash) * 100) : undefined,
      photos,
      nextService: {
        date: nextDate ? new Date(`${nextDate}T12:00:00+05:30`).toISOString() : undefined,
        odometerKm: nextKm ? Number(nextKm) : undefined,
      },
    });
    if (!result.ok) {
      setIsSaving(false);
      return setError(result.message);
    }
    toast.success(`${job.vehicle.plate} handed over. Job complete.`);
    router.push(doneHref);
  }

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <FormAlert message={error} />
      <SectionCard title="Before the customer leaves">
        <Checklist
          id="handover"
          items={checklist.map((item) => ({ label: item.label, checked: item.isDone }))}
          onToggle={(index, isDone) =>
            setChecklist((current) =>
              current.map((entry, i) => (i === index ? { ...entry, isDone } : entry)),
            )
          }
        />
      </SectionCard>
      {cashDueInPaise !== undefined && (
        <CashAtDoorCard dueInPaise={cashDueInPaise} value={cash} onChange={setCash} />
      )}
      <SectionCard title="Readings and next service">
        <div className="grid gap-4 sm:grid-cols-3">
          <ReadingField
            id="odometer-out"
            label="Odometer now (km)"
            value={odometer}
            onChange={setOdometer}
            inputMode="numeric"
          />
          <ReadingField
            id="next-date"
            label="Next service by"
            value={nextDate}
            onChange={setNextDate}
            type="date"
          />
          <ReadingField
            id="next-km"
            label="Or at (km)"
            value={nextKm}
            onChange={setNextKm}
            inputMode="numeric"
          />
        </div>
      </SectionCard>
      <SectionCard title="Photos as it leaves (optional)">
        <PhotoUpload
          id="handover-photos"
          value={photos}
          onChange={setPhotos}
          max={MAX_PHOTOS}
          label="Handover photo"
        />
      </SectionCard>
      <SubmitButton
        type="button"
        size="lg"
        isPending={isSaving}
        onClick={complete}
        disabled={!allDone}
        className="self-end"
      >
        Complete handover
      </SubmitButton>
    </div>
  );
}
