"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BranchFormDialog } from "@/features/company/components/BranchFormDialog";

export function AddBranchButton({ label }: { label: string }) {
  return (
    <BranchFormDialog
      trigger={
        <Button>
          <Plus aria-hidden />
          {label}
        </Button>
      }
    />
  );
}
