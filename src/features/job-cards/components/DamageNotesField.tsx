"use client";

import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormTextField } from "@/components/ui/FormTextField";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import type { CheckInValues } from "@/features/job-cards/schemas";

const MAX_DAMAGE_PHOTOS = 3;

/** Scratches, dents and broken parts the vehicle arrived with, so nobody is blamed later. */
export function DamageNotesField() {
  const { control } = useFormContext<CheckInValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "damages", keyName: "key" });

  return (
    <div className="flex flex-col gap-3">
      {fields.length === 0 && <p className="text-sm text-gray-500">No damage noted.</p>}
      {fields.map((damage, index) => (
        <div key={damage.key} className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <FormTextField
              control={control}
              name={`damages.${index}.area`}
              label="Where"
              placeholder="e.g. Left side panel"
            />
            <FormTextField
              control={control}
              name={`damages.${index}.note`}
              label="What"
              placeholder="e.g. Deep scratch, 10 cm"
            />
          </div>
          <Controller
            control={control}
            name={`damages.${index}.photos`}
            render={({ field }) => (
              <PhotoUpload
                id={`damage-${index}-photos`}
                value={field.value}
                onChange={field.onChange}
                max={MAX_DAMAGE_PHOTOS}
                label="Damage photo"
              />
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            className="self-start text-danger-700 hover:text-danger-700"
          >
            <Trash2 aria-hidden />
            Remove this note
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => append({ id: `dmg-${Date.now()}`, area: "", note: "", photos: [] })}
      >
        <Plus aria-hidden />
        Add damage
      </Button>
    </div>
  );
}
