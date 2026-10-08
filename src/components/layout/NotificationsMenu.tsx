"use client";

import { cva } from "class-variance-authority";
import { Bell, CircleAlert, CircleCheck, Clock, Info } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Notification } from "@/features/notifications/types";
import { formatRelativeTime } from "@/lib/format";

const TONE_ICONS = { info: Info, success: CircleCheck, warning: Clock, danger: CircleAlert };

const iconVariants = cva("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full", {
  variants: {
    tone: {
      info: "bg-info-50 text-info-700",
      success: "bg-success-50 text-success-700",
      warning: "bg-warning-50 text-warning-700",
      danger: "bg-danger-50 text-danger-700",
    },
  },
});

type NotificationsMenuProps = {
  notifications: Notification[];
};

export function NotificationsMenu({ notifications }: NotificationsMenuProps) {
  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications, ${unreadCount} unread`}
        >
          <Bell aria-hidden />
          {unreadCount > 0 && (
            <span
              aria-hidden
              className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange-600 ring-2 ring-white"
            />
          )}
        </Button>
      </DropdownMenuTrigger>
      {/* Capped at the viewport minus the page gutters so it never overflows a phone screen. */}
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-2rem)]">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between">
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-normal text-gray-500">{unreadCount} unread</span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.length === 0 && (
            <p className="px-2 py-6 text-center text-sm text-gray-500">No notifications yet.</p>
          )}
          {notifications.map((notification) => {
            const Icon = TONE_ICONS[notification.tone];
            return (
              <DropdownMenuItem key={notification.id} asChild className="items-start gap-3 py-2">
                <Link href={notification.href}>
                  <span className={iconVariants({ tone: notification.tone })}>
                    <Icon aria-hidden className="size-3.5" />
                  </span>
                  <span className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium whitespace-normal text-gray-900">
                      {notification.title}
                    </span>
                    <span className="text-xs whitespace-normal text-gray-500">
                      {notification.description}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(notification.createdAt)}
                    </span>
                  </span>
                  {!notification.isRead && (
                    <span className="mt-2 ml-auto size-2 shrink-0 rounded-full bg-orange-600">
                      <span className="sr-only">Unread</span>
                    </span>
                  )}
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
