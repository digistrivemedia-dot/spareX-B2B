"use client";

import { Controller, useFormContext } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { MAX_SHOP_PHOTOS, type RegisterValues } from "@/features/auth/schemas";

export function PhotosStep() {
  const { control } = useFormContext<RegisterValues>();

  return (
    <Controller
      control={control}
      name="photos"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="register-photos">Shop or workshop photos</FieldLabel>
          <FieldDescription id="register-photos-description">
            At least one, up to {MAX_SHOP_PHOTOS}. Include the shop front with your signboard, so
            Kannali can verify the business.
          </FieldDescription>
          <PhotoUpload
            id="register-photos"
            value={field.value}
            onChange={field.onChange}
            max={MAX_SHOP_PHOTOS}
            label="Shop photo"
            isInvalid={fieldState.invalid}
            describedBy="register-photos-description"
          />
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}
