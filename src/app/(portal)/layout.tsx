import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { Container } from "@/components/layout/Container";
import { StoreHydration } from "@/components/layout/StoreHydration";
import { TopBar } from "@/components/layout/TopBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { requireSession } from "@/features/auth/session";
import { getBranches } from "@/features/company/api";
import { BranchesProvider } from "@/features/company/components/BranchesProvider";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const [session, branches] = await Promise.all([requireSession(), getBranches()]);
  // Prices and ordering are only for businesses Kannali has approved.
  if (session.approvalStatus !== "approved") redirect("/application");

  // shadcn's sidebar remembers collapsed/expanded in this cookie.
  const sidebarOpen = (await cookies()).get("sidebar_state")?.value !== "false";

  return (
    <BranchesProvider branches={branches}>
      <SidebarProvider defaultOpen={sidebarOpen}>
        <a
          href="#content"
          className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-medium text-navy-700 shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <AppSidebar
          viewer={{
            businessType: session.business.type,
            roles: session.roles,
            creditEnabled: session.business.creditEnabled,
          }}
        />
        {/* min-w-0 lets wide tables scroll inside their own box instead of widening the page. */}
        <SidebarInset className="min-w-0">
          <TopBar session={session} />
          <div id="content" className="flex-1">
            <Container>{children}</Container>
          </div>
        </SidebarInset>
        <StoreHydration />
      </SidebarProvider>
    </BranchesProvider>
  );
}
