"use client";

import { useState } from "react";

import { CredentialsForm } from "@/features/auth/components/CredentialsForm";
import { TwoFactorForm } from "@/features/auth/components/TwoFactorForm";
import type { TwoFactorChallenge } from "@/features/auth/types";

/** Email and password first; a 6-digit code next when the account has 2-step verification on. */
export function SignInForm() {
  const [challenge, setChallenge] = useState<TwoFactorChallenge | null>(null);

  if (challenge) {
    return (
      <TwoFactorForm
        challengeId={challenge.challengeId}
        maskedPhone={challenge.maskedPhone}
        onBack={() => setChallenge(null)}
      />
    );
  }

  return <CredentialsForm onTwoFactorRequired={setChallenge} />;
}
