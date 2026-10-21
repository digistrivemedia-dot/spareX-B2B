import type { ReactNode } from "react";

/** A column of label / value pairs, e.g. a customer's name and mobile. */
export function DetailList({ children }: { children: ReactNode }) {
  return <dl className="flex flex-col gap-3 text-sm">{children}</dl>;
}

export function DetailItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{children}</dd>
    </div>
  );
}
