import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  /** Usually a "View all" link. */
  action?: ReactNode;
};

/** The title row above a section of a page. */
export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
  );
}
