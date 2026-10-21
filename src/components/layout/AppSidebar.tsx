"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/layout/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { getVisibleNavigation, type NavViewer } from "@/lib/navigation";

/** Collapses to icons on desktop and opens as a drawer on mobile. */
export function AppSidebar({ viewer }: { viewer: NavViewer }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const sections = getVisibleNavigation(viewer);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 justify-center overflow-hidden px-2">
        <Link
          href="/dashboard"
          aria-label="SpareX Business home"
          className="rounded-lg focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-none"
        >
          <Logo background="dark" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {sections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={label}
                    isActive={pathname === href || pathname.startsWith(`${href}/`)}
                  >
                    <Link href={href} onClick={() => setOpenMobile(false)}>
                      <Icon aria-hidden />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
