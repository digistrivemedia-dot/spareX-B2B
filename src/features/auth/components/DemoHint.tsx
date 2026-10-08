import { Info } from "lucide-react";
import type { ReactNode } from "react";

import { dataSource } from "@/lib/config";

/** Tells demo viewers how to get through a form. Disappears once real auth is switched on. */
export function DemoHint({ children }: { children: ReactNode }) {
  if (dataSource.auth !== "mock") return null;

  return (
    <p className="flex items-start gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-xs text-gray-600">
      <Info aria-hidden className="mt-px size-3.5 shrink-0 text-navy-700" />
      <span>{children}</span>
    </p>
  );
}
