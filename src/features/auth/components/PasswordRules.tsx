import { Check, Circle } from "lucide-react";

import { PASSWORD_RULES } from "@/features/auth/schemas";
import { cn } from "@/lib/utils";

/** The password rules as a checklist that ticks off while typing. */
export function PasswordRules({ password, id }: { password: string; id: string }) {
  return (
    <ul id={id} className="flex flex-col gap-1 text-sm">
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);
        const Icon = isMet ? Check : Circle;
        return (
          <li
            key={rule.label}
            className={cn("flex items-center gap-2", isMet ? "text-success-700" : "text-gray-500")}
          >
            <Icon aria-hidden className="size-3.5" />
            {rule.label}
            <span className="sr-only">{isMet ? " (done)" : " (not yet)"}</span>
          </li>
        );
      })}
    </ul>
  );
}
