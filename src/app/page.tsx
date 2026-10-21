import { redirect } from "next/navigation";

import { getHomePath } from "@/features/auth/permissions";
import { requireSession } from "@/features/auth/session";

export default async function HomePage() {
  const { roles } = await requireSession();
  redirect(getHomePath(roles));
}
