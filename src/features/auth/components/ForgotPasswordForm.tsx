"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FieldGroup } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { requestPasswordReset } from "@/features/auth/api";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/api-client";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  async function onSubmit({ email }: ForgotPasswordValues) {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      form.setError("root", { message: getErrorMessage(error) });
    }
  }

  const backToSignIn = (
    <Button variant="link" className="px-0" asChild>
      <Link href="/login">Back to sign in</Link>
    </Button>
  );

  if (isSubmitSuccessful && !errors.root) {
    return (
      <EmptyState
        icon={MailCheck}
        title="Check your inbox"
        // Deliberately vague, so the form can't be used to find out which emails have accounts.
        description={`If ${form.getValues("email")} has a SpareX Business account, we've emailed a link to reset the password. It expires in 30 minutes.`}
        action={backToSignIn}
        className="py-4"
      />
    );
  }

  return (
    <>
      <AuthHeading
        title="Reset your password"
        description="Enter your business email and we'll send you a link to set a new password."
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
          <SubmitButton isPending={isSubmitting} size="lg">
            Send reset link
          </SubmitButton>
          <div className="text-center">{backToSignIn}</div>
        </FieldGroup>
      </form>
    </>
  );
}
