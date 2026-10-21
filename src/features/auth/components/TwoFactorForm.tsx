"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { verifyTwoFactorAction } from "@/features/auth/actions";
import { resendTwoFactorCode } from "@/features/auth/api";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { DemoHint } from "@/features/auth/components/DemoHint";
import { twoFactorSchema, type TwoFactorValues } from "@/features/auth/schemas";
import { getErrorMessage } from "@/lib/api-client";

const CODE_LENGTH = 6;

type TwoFactorFormProps = {
  challengeId: string;
  maskedPhone: string;
  /** Goes back to the email and password step. */
  onBack: () => void;
};

export function TwoFactorForm({ challengeId, maskedPhone, onBack }: TwoFactorFormProps) {
  const router = useRouter();
  const form = useForm<TwoFactorValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  async function onSubmit({ code }: TwoFactorValues) {
    const result = await verifyTwoFactorAction({ challengeId, code });
    if (result.ok) router.push("/");
    else form.setError("root", { message: result.message });
  }

  async function handleResend() {
    try {
      await resendTwoFactorCode(challengeId);
      toast.success(`We've sent a new code to ${maskedPhone}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <>
      <AuthHeading
        title="Enter your verification code"
        description={
          <>
            We&apos;ve sent a 6-digit code by SMS to{" "}
            <span className="whitespace-nowrap">{maskedPhone}</span>.
          </>
        }
      />
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <FieldGroup>
          <FormAlert message={errors.root?.message} />
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="code">Verification code</FieldLabel>
                <InputOTP
                  {...field}
                  id="code"
                  maxLength={CODE_LENGTH}
                  pattern={REGEXP_ONLY_DIGITS}
                  autoComplete="one-time-code"
                  autoFocus
                  aria-invalid={fieldState.invalid}
                  // Saves a click: the form submits as soon as the last digit is typed.
                  onComplete={() => form.handleSubmit(onSubmit)()}
                >
                  <InputOTPGroup>
                    {Array.from({ length: CODE_LENGTH }, (_, index) => (
                      <InputOTPSlot key={index} index={index} aria-invalid={fieldState.invalid} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <SubmitButton isPending={isSubmitting || isSubmitSuccessful} size="lg">
            Verify and sign in
          </SubmitButton>
          <DemoHint>Any 6 digits will work.</DemoHint>
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <Button type="button" variant="link" className="px-0" onClick={onBack}>
              Use a different account
            </Button>
            <Button type="button" variant="link" className="px-0" onClick={handleResend}>
              Resend code
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
}
