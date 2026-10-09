"use client";

import { createContext, use, type ReactNode } from "react";

import type { Branch } from "@/features/company/types";

const BranchesContext = createContext<Branch[]>([]);

/** Makes the business's branches available to every client component in the portal. */
export function BranchesProvider({
  branches,
  children,
}: {
  branches: Branch[];
  children: ReactNode;
}) {
  return <BranchesContext value={branches}>{children}</BranchesContext>;
}

export function useBranches(): Branch[] {
  return use(BranchesContext);
}
