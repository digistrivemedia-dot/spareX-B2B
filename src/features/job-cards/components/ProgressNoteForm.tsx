"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { addProgressNoteAction } from "@/features/job-cards/actions";

const MAX_PHOTOS = 4;

/** A quick update with photos; ticking "extra work" flags it for the manager to quote. */
export function ProgressNoteForm({ jobId }: { jobId: string }) {
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isExtraWork, setIsExtraWork] = useState(false);
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    if (text.trim().length < 3) return setError("Write a short update first.");
    setIsSaving(true);
    const result = await addProgressNoteAction(jobId, { text: text.trim(), photos, isExtraWork });
    setIsSaving(false);
    if (!result.ok) return setError(result.message);
    toast.success(isExtraWork ? "Extra work reported to your manager" : "Update added");
    setText("");
    setPhotos([]);
    setIsExtraWork(false);
    setError(undefined);
  }

  return (
    <div className="flex flex-col gap-3">
      <Field data-invalid={Boolean(error)}>
        <FieldLabel htmlFor="progress-text">Update</FieldLabel>
        <Textarea
          id="progress-text"
          rows={3}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="e.g. Pads replaced, bleeding the front brake now."
          aria-invalid={Boolean(error)}
        />
        <FieldError>{error}</FieldError>
      </Field>
      <PhotoUpload
        id="progress-photos"
        value={photos}
        onChange={setPhotos}
        max={MAX_PHOTOS}
        label="Progress photo"
      />
      <label
        htmlFor="progress-extra"
        className="flex min-h-10 items-start gap-3 text-sm text-gray-700"
      >
        <Checkbox
          id="progress-extra"
          checked={isExtraWork}
          onCheckedChange={(checked) => setIsExtraWork(checked === true)}
          className="mt-0.5"
        />
        This is extra work that needs the customer&apos;s approval
      </label>
      <SubmitButton
        type="button"
        variant="secondary"
        isPending={isSaving}
        onClick={save}
        className="self-start"
      >
        {isExtraWork ? "Report extra work" : "Add update"}
      </SubmitButton>
    </div>
  );
}
