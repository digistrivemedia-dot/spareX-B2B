import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { requirePermission } from "@/features/auth/session";
import { QuickOrderEditor } from "@/features/quick-order/components/QuickOrderEditor";

export const metadata: Metadata = {
  title: "Quick order",
};

export default async function QuickOrderPage() {
  await requirePermission("orders:place");
  return (
    <>
      <PageHeader
        title="Quick order"
        description="Type part numbers or paste a list. Enter moves to the next row; Ctrl+Enter adds everything to the cart."
      />
      <QuickOrderEditor />
    </>
  );
}
