import type { Metadata } from "next";

import { getApplication } from "@/features/auth/api";
import { RegisterForm } from "@/features/auth/components/RegisterForm";
import { toRegisterValues } from "@/features/auth/utils";
import { getParam, pickParam, type RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Register your business",
};

type RegisterPageProps = {
  /** `?ref=…&mode=resubmit|reapply` starts from an earlier application. */
  searchParams: Promise<RawSearchParams>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const ref = getParam(params, "ref");
  const mode = pickParam(params, "mode", ["resubmit", "reapply"] as const);
  const application = ref && mode ? await getApplication(ref) : null;
  // Only a sent-back application can be corrected, and only a rejected one reapplied for.
  const canUse =
    application &&
    ((mode === "resubmit" && application.status === "sent_back") ||
      (mode === "reapply" && application.status === "rejected"));

  return (
    <RegisterForm
      previous={
        canUse && ref && mode
          ? { ref, mode, values: toRegisterValues(application.application) }
          : undefined
      }
    />
  );
}
