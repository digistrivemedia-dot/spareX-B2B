import type { ReactNode } from "react";

type AuthHeadingProps = {
  title: string;
  description?: ReactNode;
};

/** The title block at the top of every sign-in and registration card. */
export function AuthHeading({ title, description }: AuthHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-1.5">
      <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}
