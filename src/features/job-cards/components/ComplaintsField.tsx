"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

/** Any form with a list of complaints: the walk-in and the check-in. */
type ComplaintsFormValues = { complaints: { text: string }[] };

/** What the customer wants looked at, one line each, in their words. */
export function ComplaintsField() {
  const { control, register, formState } = useFormContext<ComplaintsFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name: "complaints" });
  const error = formState.errors.complaints;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-1 text-sm font-medium text-gray-900">Customer&apos;s complaints</legend>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <Input
            aria-label={`Complaint ${index + 1}`}
            placeholder={index === 0 ? "e.g. Brakes squeak when wet" : undefined}
            {...register(`complaints.${index}.text`)}
          />
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
              aria-label={`Remove complaint ${index + 1}`}
              className="text-gray-500 hover:text-danger-700"
            >
              <Trash2 aria-hidden />
            </Button>
          )}
        </div>
      ))}
      <FieldError errors={[error?.root ?? (error && "message" in error ? error : undefined)]} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="self-start"
        onClick={() => append({ text: "" })}
      >
        <Plus aria-hidden />
        Add another
      </Button>
    </fieldset>
  );
}
