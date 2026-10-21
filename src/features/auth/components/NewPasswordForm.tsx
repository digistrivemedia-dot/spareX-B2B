"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { setPassword } from "@/features/auth/api";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PasswordRules } from "@/features/auth/components/PasswordRules";
import { newPasswordSchema, type NewPasswordValues } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/api-client";

type NewPasswordFormProps =
  /** From the emailed reset link: afterwards, sign in with the new password. */
  | { mode: "reset"; resetToken: string }
  /** On first login: afterwards, straight into the portal. */
  | { mode: "first_login" };

const COPY = {
  reset: {
    title: "Choose a new password",
    description: "Use it to sign in to SpareX Business from now on.",
    submit: "Save new password",
  },
  first_login: {
    title: "Set your password",
    description: "Welcome to SpareX Business. Choose a password to replace the one we emailed.",
    submit: "Save and continue",
  },
};

export function NewPasswordForm(props: NewPasswordFormProps) {
  const router = useRouter();
  const form = useForm<NewPasswordValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control: form.control, name: "password" });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;
  const copy = COPY[props.mode];

  async function onSubmit({ password: chosen }: NewPasswordValues) {
    try {
      await setPassword({
        password: chosen,
        resetToken: props.mode === "reset" ? props.resetToken : undefined,
      });
      if (props.mode === "first_login") {
        toast.success("Password saved");
        router.push("/dashboard");
      }
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  if (props.mode === "reset" && isSubmitSuccessful && !errors.root) {
    return (
      <EmptyState
        icon={KeyRound}
        title="Password changed"
        description="Sign in with your new password."
        action={
          <Button asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        }
        className="py-4"
      />
    );
  }

  return (
    <>
      <AuthHeading title={copy.title} description={copy.description} />
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FormAlert message={errors.root?.message} />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="new-password">New password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="new-password"
                  autoComplete="new-password"
                  autoFocus
                  aria-invalid={fieldState.invalid}
                  aria-describedby="password-rules"
                />
                <PasswordRules password={password} id="password-rules" />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="confirm-password">Type it again</FieldLabel>
                <PasswordInput
                  {...field}
                  id="confirm-password"
                  autoComplete="new-password"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <SubmitButton isPending={isSubmitting || isSubmitSuccessful} size="lg">
            {copy.submit}
          </SubmitButton>
        </FieldGroup>
      </form>
    </>
  );
}
