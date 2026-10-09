import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { RadioGroupItem } from "@/components/ui/radio-group";

type ChoiceCardProps = {
  id: string;
  value: string;
  title: string;
  icon?: LucideIcon;
  disabled?: boolean;
  /** Details under the title, e.g. an address or available credit. */
  children?: ReactNode;
};

/** A radio option drawn as a card; the whole card is the click target. Use inside a RadioGroup. */
export function ChoiceCard({ id, value, title, icon: Icon, disabled, children }: ChoiceCardProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-gray-300 has-data-[state=checked]:border-navy-700 has-data-[state=checked]:bg-navy-50 has-[:disabled]:cursor-not-allowed has-[:disabled]:bg-gray-50 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
    >
      <RadioGroupItem id={id} value={value} disabled={disabled} className="mt-0.5" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {Icon && <Icon aria-hidden className="size-4 text-navy-700" />}
          {title}
        </span>
        {children && <div className="text-sm text-gray-600">{children}</div>}
      </div>
    </label>
  );
}
