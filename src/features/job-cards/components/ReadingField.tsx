"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ReadingFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: "numeric";
};

/** A labelled reading on the handover: odometer, next-service date or km. */
export function ReadingField({
  id,
  label,
  value,
  onChange,
  type = "text",
  inputMode,
}: ReadingFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(event) =>
          onChange(inputMode ? event.target.value.replace(/\D/g, "") : event.target.value)
        }
      />
    </div>
  );
}
