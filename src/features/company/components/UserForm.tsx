"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { FormAlert } from "@/components/ui/FormAlert";
import { FormTextField } from "@/components/ui/FormTextField";
import { SectionCard } from "@/components/ui/SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { saveCompanyUserAction } from "@/features/company/actions";
import { useBranches } from "@/features/company/components/BranchesProvider";
import { RolePicker } from "@/features/company/components/RolePicker";
import { companyUserSchema, type CompanyUserValues } from "@/features/company/schemas";
import type { CompanyUser } from "@/features/company/types";
import { toMobileDigits } from "@/lib/input-format";

/** Adds a user (who gets an email invitation) or edits one: details, roles and branch. */
export function UserForm({ user }: { user?: CompanyUser }) {
  const router = useRouter();
  const branches = useBranches();
  const form = useForm<CompanyUserValues>({
    resolver: zodResolver(companyUserSchema),
    defaultValues: user
      ? { ...user, phone: user.phone.replace(/^\+91/, "") }
      : { name: "", email: "", phone: "", roles: [], branchId: "" },
  });

  async function onSubmit(values: CompanyUserValues) {
    const result = await saveCompanyUserAction(user?.id ?? null, {
      ...values,
      phone: `+91${values.phone}`,
    });
    if (!result.ok) return form.setError("root", { message: result.message });
    toast.success(user ? `${values.name} updated` : `Invitation sent to ${values.email}`);
    router.push("/company/users");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      <FormAlert message={form.formState.errors.root?.message} />
      <SectionCard title="Details">
        <FieldGroup>
          <FormTextField control={form.control} name="name" label="Full name" autoComplete="off" />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="off"
              description={user ? undefined : "We'll email an invitation to set a password."}
            />
            <FormTextField
              control={form.control}
              name="phone"
              label="Mobile"
              type="tel"
              inputMode="numeric"
              prefixText="+91"
              normalize={toMobileDigits}
            />
          </div>
          <Controller
            control={form.control}
            name="branchId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="user-branch">Branch</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id="user-branch"
                    className="w-full sm:w-72"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        </FieldGroup>
      </SectionCard>
      <SectionCard title="Roles">
        <Controller
          control={form.control}
          name="roles"
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-gray-500">Choose one or more. Roles are fixed.</p>
              <RolePicker
                value={field.value}
                onChange={field.onChange}
                isInvalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </div>
          )}
        />
      </SectionCard>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" asChild>
          <Link href="/company/users">Cancel</Link>
        </Button>
        <SubmitButton isPending={form.formState.isSubmitting}>
          {user ? "Save changes" : "Add and send invitation"}
        </SubmitButton>
      </div>
    </form>
  );
}
