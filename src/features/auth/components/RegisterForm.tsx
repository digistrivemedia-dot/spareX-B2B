"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { flushSync } from "react-dom";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { registerBusinessAction, resubmitApplicationAction } from "@/features/auth/actions";
import { AuthHeading } from "@/features/auth/components/AuthHeading";
import { BusinessStep } from "@/features/auth/components/BusinessStep";
import { ContactStep } from "@/features/auth/components/ContactStep";
import { PhotosStep } from "@/features/auth/components/PhotosStep";
import { RegisterProgress } from "@/features/auth/components/RegisterProgress";
import { ReviewStep } from "@/features/auth/components/ReviewStep";
import { REGISTER_STEPS, registerSchema, type RegisterValues } from "@/features/auth/schemas";
import { toRegistrationApplication, toRegisterValues } from "@/features/auth/utils";

const LAST_STEP = REGISTER_STEPS.length - 1;

const EMPTY_VALUES = {
  businessName: "",
  gstin: "",
  pan: "",
  licenceNumber: "",
  otherRegistration: "",
  documents: [],
  contactName: "",
  email: "",
  mobile: "",
  addressLine1: "",
  addressLine2: "",
  pin: "",
  city: "",
  state: "",
  photos: [],
};

type RegisterFormProps = {
  /**
   * An earlier application to start from: "resubmit" corrects a sent-back one under the same
   * reference; "reapply" starts a new application after a rejection.
   */
  previous?: {
    ref: string;
    mode: "resubmit" | "reapply";
    values: ReturnType<typeof toRegisterValues>;
  };
};

/** A 4-step wizard over one form; each step validates only its own fields before moving on. */
export function RegisterForm({ previous }: RegisterFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    defaultValues: { ...(previous?.values ?? EMPTY_VALUES), acceptTerms: false },
  });
  const { isSubmitting, isSubmitSuccessful, errors } = form.formState;

  function goToStep(next: number) {
    // Render the new step first, then move focus to its heading for keyboard and screen-reader users.
    flushSync(() => setStep(next));
    stepHeadingRef.current?.focus();
  }

  async function submitApplication(values: RegisterValues) {
    const application = toRegistrationApplication(values);
    const result =
      previous?.mode === "resubmit"
        ? await resubmitApplicationAction(previous.ref, application)
        : await registerBusinessAction(application);
    if (!result.ok) return form.setError("root", { message: result.message });
    router.push(`/register/submitted?ref=${encodeURIComponent(result.data.referenceNumber)}`);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (step === LAST_STEP) return form.handleSubmit(submitApplication)(event);
    event.preventDefault();
    const { fields } = REGISTER_STEPS[step];
    if (await form.trigger([...fields], { shouldFocus: true })) return goToStep(step + 1);
    // trigger() doesn't mark fields as touched, so without this a corrected field would stay red
    // until it lost focus. Touched fields re-validate on every change ("onTouched" mode).
    for (const name of fields) form.setValue(name, form.getValues(name), { shouldTouch: true });
  }

  return (
    <>
      <AuthHeading
        title={
          previous?.mode === "resubmit" ? "Correct your application" : "Register your business"
        }
        description={
          previous?.mode === "resubmit"
            ? `Make the changes Kannali asked for, then send ${previous.ref} again.`
            : "Get business prices on every part, quotations and GST invoices. It takes about 3 minutes."
        }
      />
      <RegisterProgress currentStep={step} />
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} noValidate>
          <FieldGroup>
            <h2
              ref={stepHeadingRef}
              tabIndex={-1}
              className="text-base font-semibold text-gray-900 outline-none"
            >
              {REGISTER_STEPS[step].title}
            </h2>
            <FormAlert message={errors.root?.message} />
            {step === 0 && <BusinessStep />}
            {step === 1 && <ContactStep />}
            {step === 2 && <PhotosStep />}
            {step === 3 && <ReviewStep onEditStep={goToStep} />}
            <div className="flex gap-3">
              {step > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => goToStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <SubmitButton
                isPending={isSubmitting || isSubmitSuccessful}
                size="lg"
                className="flex-1"
              >
                {step !== LAST_STEP
                  ? "Continue"
                  : previous?.mode === "resubmit"
                    ? "Send corrections"
                    : "Submit application"}
              </SubmitButton>
            </div>
          </FieldGroup>
        </form>
      </FormProvider>
      <p className="mt-6 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-navy-700 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
