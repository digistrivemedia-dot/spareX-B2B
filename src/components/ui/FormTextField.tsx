"use client";

import type { ComponentProps, ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FormTextFieldProps<T extends FieldValues> = Omit<
  ComponentProps<"input">,
  "name" | "id" | "value" | "defaultValue" | "onChange" | "onBlur" | "prefix"
> & {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
  /** Fixed text inside the input's left edge, e.g. "+91". */
  prefixText?: string;
  /** Rewrites what is typed before it is stored, e.g. to upper case. */
  normalize?: (value: string) => string;
  /** Called after every change with the stored value, for fields that fill in others. */
  onValueChange?: (value: string) => void;
};

/** A labelled text input bound to react-hook-form, with its description and error. */
export function FormTextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  prefixText,
  normalize,
  onValueChange,
  ...inputProps
}: FormTextFieldProps<T>) {
  const descriptionId = description ? `${name}-description` : undefined;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <div className="relative">
            {prefixText && (
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">
                {prefixText}
              </span>
            )}
            <Input
              {...inputProps}
              id={name}
              name={field.name}
              ref={field.ref}
              value={field.value ?? ""}
              onBlur={field.onBlur}
              onChange={(event) => {
                const value = normalize ? normalize(event.target.value) : event.target.value;
                field.onChange(value);
                onValueChange?.(value);
              }}
              aria-invalid={fieldState.invalid}
              aria-describedby={descriptionId}
              // Room for the prefix: "+91" needs more than a single symbol like "₹".
              className={cn(prefixText && (prefixText.length > 1 ? "pl-12" : "pl-7"))}
            />
          </div>
          {description && <FieldDescription id={descriptionId}>{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
