import type { ReactNode } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { TabNav } from "@/components/ui/TabNav";
import { can } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";

export default async function CompanyLayout({ children }: { children: ReactNode }) {
  const { business, roles } = await requirePermission("company:view");
  // Only garages have staff logins; other businesses have one login.
  const showUsers = business.type === "garage" && can(roles, "users:manage");

  return (
    <>
      <PageHeader title="Company" description={business.name} />
      <TabNav
        label="Company sections"
        tabs={[
          { label: "Business profile", href: "/company" },
          { label: "Delivery addresses", href: "/company/addresses" },
          ...(showUsers ? [{ label: "Users", href: "/company/users" }] : []),
        ]}
      />
      {children}
    </>
  );
}
