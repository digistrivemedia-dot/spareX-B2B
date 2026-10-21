"use client";

import { Pencil, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { deleteBranchAction, setMainBranchAction } from "@/features/company/actions";
import { BranchFormDialog } from "@/features/company/components/BranchFormDialog";
import type { Branch } from "@/features/company/types";

/** Edit, make main, and remove: the main branch can only be edited. */
export function BranchActions({ branch }: { branch: Branch }) {
  return (
    <div className="flex flex-wrap gap-2">
      <BranchFormDialog
        branch={branch}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil aria-hidden />
            Edit
          </Button>
        }
      />
      {!branch.isMain && (
        <>
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm">
                <Star aria-hidden />
                Make main
              </Button>
            }
            title={`Make ${branch.name} the main branch?`}
            description="The main branch is the default delivery address for new orders."
            confirmLabel="Make main"
            successMessage={`${branch.name} is now the main branch`}
            onConfirm={() => setMainBranchAction(branch.id)}
          />
          <ConfirmDialog
            trigger={
              <Button variant="ghost" size="sm" className="text-danger-700 hover:text-danger-700">
                <Trash2 aria-hidden />
                Remove
              </Button>
            }
            title={`Remove ${branch.name}?`}
            description="Past orders keep this address. You won't be able to deliver here any more."
            confirmLabel="Remove branch"
            successMessage={`${branch.name} removed`}
            onConfirm={() => deleteBranchAction(branch.id)}
            isDestructive
          />
        </>
      )}
    </div>
  );
}
