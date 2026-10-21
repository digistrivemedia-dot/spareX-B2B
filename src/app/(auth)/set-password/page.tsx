import type { Metadata } from "next";

import { NewPasswordForm } from "@/features/auth/components/NewPasswordForm";

export const metadata: Metadata = {
  title: "Set your password",
};

export default function SetPasswordPage() {
  return <NewPasswordForm mode="first_login" />;
}
