import type { ReactNode } from "react";

/** A titled group of filter controls. */
export function FilterSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-2 border-b border-gray-200 pb-5 last:border-0 last:pb-0">
      <legend className="mb-2 text-sm font-semibold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );
}
