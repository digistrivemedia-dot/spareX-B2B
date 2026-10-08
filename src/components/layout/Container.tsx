import type { ReactNode } from "react";

/** The page content column inside the app shell. */
export function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 lg:px-8">{children}</div>
  );
}
