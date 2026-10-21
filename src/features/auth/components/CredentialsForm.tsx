"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signIn } from "@/features/auth/api";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { DemoHint } from "@/features/auth/components/DemoHint";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { signInSchema, type SignInValues } from "@/features/auth/schemas";
import type { TwoFactorChallenge } from "@/features/auth/types";
import { getSignedInDestination } from "@/features/auth/utils";
import { getErrorMessage } from "@/lib/api-client";

type CredentialsFormProps = {
  onTwoFactorRequired: (challenge: TwoFactorChallenge) => void;
};

export function CredentialsForm({ onTwoFactorRequired }: CredentialsFormProps) {
  const router = useRouter();
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  async function onSubmit(values: SignInValues) {
    try {
      const result = await signIn(values);
      if (result.status === "two_factor_required") onTwoFactorRequired(result);
      else router.push(getSignedInDestination(result));
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  return (
    <>
      <AuthHeading
        title="Sign in"
        description="Order parts at your business prices, track orders and pay invoices."
      />
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FormAlert message={errors.root?.message} />
          <FormTextField
            control={form.control}
            name="email"
            label="Business email"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-navy-700 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  {...field}
                  id="password"
                  autoComplete="current-password"
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <SubmitButton isPending={isSubmitting || isSubmitSuccessful} size="lg">
            Sign in
          </SubmitButton>
          <DemoHint>
            Any email and a password of 8 or more characters signs in. Try
            mahesh@srisaiworks.example.com for 2-step verification; review@, sentback@ or
            rejected@sparex.example.com for an application&apos;s status; and new@sparex.example.com
            for a first login.
          </DemoHint>
        </FieldGroup>
      </form>
      <p className="mt-6 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
        New to SpareX Business?{" "}
        <Link href="/register" className="font-medium text-navy-700 hover:underline">
          Register your business
        </Link>
      </p>
    </>
  );
}
