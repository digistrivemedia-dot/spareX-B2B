"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from "@/features/auth/roles";
import type { Role } from "@/features/auth/types";

type RolePickerProps = {
  value: Role[];
  onChange: (roles: Role[]) => void;
  isInvalid?: boolean;
};

/** The five fixed garage roles as tick boxes, each with what that role works on. */
export function RolePicker({ value, onChange, isInvalid }: RolePickerProps) {
  const toggle = (role: Role, checked: boolean) =>
    onChange(checked ? [...value, role] : value.filter((selected) => selected !== role));

  return (
    <fieldset aria-invalid={isInvalid || undefined} className="grid gap-2 sm:grid-cols-2">
      <legend className="sr-only">Roles</legend>
      {ROLES.map((role) => {
        const id = `role-${role}`;
        return (
          <label
            key={role}
            htmlFor={id}
            className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white p-3 text-sm has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50"
          >
            <Checkbox
              id={id}
              checked={value.includes(role)}
              onCheckedChange={(checked) => toggle(role, checked === true)}
              className="mt-0.5"
            />
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-900">{ROLE_LABELS[role]}</span>
              <span className="text-xs text-gray-500">{ROLE_DESCRIPTIONS[role]}</span>
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
