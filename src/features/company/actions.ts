"use server";

import { revalidatePath } from "next/cache";

import {
  createBranch,
  createCompanyUser,
  deleteBranch,
  resendInvite,
  setCompanyUserStatus,
  setMainBranch,
  updateBranch,
  updateBusinessContact,
  updateCompanyUser,
} from "@/features/company/api";
import type {
  BranchInput,
  BusinessContactUpdate,
  CompanyUserInput,
} from "@/features/company/types";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

// Branches feed the top bar's branch switcher on every page, so refresh the whole portal.
const refreshPortal = () => revalidatePath("/", "layout");

export async function saveBranchAction(
  id: string | null,
  input: BranchInput,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await (id ? updateBranch(id, input) : createBranch(input));
    refreshPortal();
    return null;
  });
}

export async function deleteBranchAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await deleteBranch(id);
    refreshPortal();
    return null;
  });
}

export async function setMainBranchAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await setMainBranch(id);
    refreshPortal();
    return null;
  });
}

export async function updateBusinessContactAction(
  update: BusinessContactUpdate,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await updateBusinessContact(update);
    refreshPortal();
    return null;
  });
}

export async function saveCompanyUserAction(
  id: string | null,
  input: CompanyUserInput,
): Promise<ActionResult<{ id: string }>> {
  return toActionResult(async () => {
    const user = await (id ? updateCompanyUser(id, input) : createCompanyUser(input));
    revalidatePath("/company/users");
    return { id: user.id };
  });
}

export async function setCompanyUserStatusAction(
  id: string,
  status: "active" | "disabled",
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await setCompanyUserStatus(id, status);
    revalidatePath("/company/users");
    revalidatePath(`/company/users/${id}`);
    return null;
  });
}

export async function resendInviteAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await resendInvite(id);
    return null;
  });
}
