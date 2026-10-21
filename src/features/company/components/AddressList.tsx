import { MapPin } from "lucide-react";

import { StatusBadge } from "@/components/ui/StatusBadge";
import { BranchActions } from "@/features/company/components/BranchActions";
import type { Branch } from "@/features/company/types";
import { formatPhone } from "@/lib/format";

/** Every delivery address (branch) as a card, the main one first. */
export function AddressList({ branches }: { branches: Branch[] }) {
  const sorted = [...branches].sort((a, b) => Number(b.isMain) - Number(a.isMain));

  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {sorted.map((branch) => (
        <li
          key={branch.id}
          className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-navy-700" />
            <div className="flex min-w-0 flex-1 flex-col gap-1 text-sm">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">{branch.name}</span>
                {branch.isMain && <StatusBadge status="active">Main · default</StatusBadge>}
              </span>
              <span className="text-gray-700">
                {[
                  branch.address.line1,
                  branch.address.line2,
                  branch.address.city,
                  branch.address.state,
                ]
                  .filter(Boolean)
                  .join(", ")}{" "}
                {branch.address.pin}
              </span>
              <span className="text-xs text-gray-500">
                {branch.contactName} · {formatPhone(branch.contactPhone)}
              </span>
            </div>
          </div>
          <BranchActions branch={branch} />
        </li>
      ))}
    </ul>
  );
}
