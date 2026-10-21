import { AccountMenu } from "@/components/layout/AccountMenu";
import { BranchSwitcher } from "@/components/layout/BranchSwitcher";
import { CartButton } from "@/components/layout/CartButton";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { NotificationsMenu } from "@/components/layout/NotificationsMenu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { can } from "@/features/auth/permissions";
import { describeRoles } from "@/features/auth/roles";
import type { Session } from "@/features/auth/types";
import { getNotifications } from "@/features/notifications/api";

type TopBarProps = {
  session: Session;
};

export async function TopBar({ session }: TopBarProps) {
  const notifications = await getNotifications();
  // Parts search, delivery branch and cart are for people who buy from SpareX.
  const canBuy = can(session.roles, "orders:place");

  return (
    // Phones get search on its own full-width row; from md up everything sits on one row.
    <header className="sticky top-0 z-30 flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 md:h-16 md:flex-nowrap md:gap-4 md:px-6 md:py-0 print:hidden">
      <SidebarTrigger className="-ml-1" />
      {canBuy && <GlobalSearch className="order-last basis-full md:order-none md:basis-auto" />}
      <div className="ml-auto flex items-center gap-1">
        {canBuy && <BranchSwitcher />}
        {canBuy && <CartButton />}
        <NotificationsMenu notifications={notifications} />
        <AccountMenu
          userName={session.user.name}
          email={session.user.email}
          businessName={session.business.name}
          roleLabel={describeRoles(session.roles)}
        />
      </div>
    </header>
  );
}
