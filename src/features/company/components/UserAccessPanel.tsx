"use client";

import { Mail, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { resendInviteAction, setCompanyUserStatusAction } from "@/features/company/actions";
import type { CompanyUser } from "@/features/company/types";
import { formatRelativeTime } from "@/lib/format";

/** The user's login: whether it's active, plus disable / enable and resend the invitation. */
export function UserAccessPanel({ user }: { user: CompanyUser }) {
  const [isResending, setIsResending] = useState(false);
  const isDisabled = user.status === "disabled";

  async function resend() {
    setIsResending(true);
    const result = await resendInviteAction(user.id);
    setIsResending(false);
    if (result.ok) toast.success(`Invitation sent again to ${user.email}`);
    else toast.error(result.message);
  }

  return (
    <SectionCard title="Login">
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={user.status} />
          <span className="text-gray-500">
            {user.lastActiveAt
              ? `Last active ${formatRelativeTime(user.lastActiveAt)}`
              : "Hasn't signed in yet"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {user.status === "invited" && (
            <Button variant="outline" onClick={resend} disabled={isResending}>
              <Mail aria-hidden />
              Resend invitation
            </Button>
          )}
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                className={isDisabled ? undefined : "text-danger-700 hover:text-danger-700"}
              >
                {isDisabled ? <UserCheck aria-hidden /> : <UserX aria-hidden />}
                {isDisabled ? "Enable login" : "Disable login"}
              </Button>
            }
            title={isDisabled ? `Enable ${user.name}?` : `Disable ${user.name}?`}
            description={
              isDisabled
                ? "They can sign in again with their existing password."
                : "They can't sign in until you enable them again. Their jobs and history stay."
            }
            confirmLabel={isDisabled ? "Enable" : "Disable"}
            successMessage={isDisabled ? `${user.name} can sign in again` : `${user.name} disabled`}
            onConfirm={() =>
              setCompanyUserStatusAction(user.id, isDisabled ? "active" : "disabled")
            }
            isDestructive={!isDisabled}
          />
        </div>
      </div>
    </SectionCard>
  );
}
