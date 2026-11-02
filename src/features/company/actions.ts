"use server";

import { revalidatePath } from "next/cache";

import {
  createBranch,
  createCompanyUser,
  deleteBranch,
  lookupPincode,
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
  PincodeDetails,
} from "@/features/company/types";
import { authorizeAction } from "@/features/auth/session";
import { toActionResult } from "@/lib/actions";
import type { ActionResult } from "@/lib/types";

/** PIN code → city and state. Open to everyone: registration uses it before sign-in. */
export async function lookupPincodeAction(
  pin: string,
): Promise<ActionResult<PincodeDetails | null>> {
  return toActionResult(() => lookupPincode(pin));
}

// Branches feed the top bar's branch switcher on every page, so refresh the whole portal.
const refreshPortal = () => revalidatePath("/", "layout");

export async function saveBranchAction(
  id: string | null,
  input: BranchInput,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("company:manage");
    await (id ? updateBranch(id, input) : createBranch(input));
    refreshPortal();
    return null;
  });
}

export async function deleteBranchAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("company:manage");
    await deleteBranch(id);
    refreshPortal();
    return null;
  });
}

export async function setMainBranchAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("company:manage");
    await setMainBranch(id);
    refreshPortal();
    return null;
  });
}

export async function updateBusinessContactAction(
  update: BusinessContactUpdate,
): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("company:manage");
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
    await authorizeAction("users:manage", ["garage"]);
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
    await authorizeAction("users:manage", ["garage"]);
    await setCompanyUserStatus(id, status);
    revalidatePath("/company/users");
    revalidatePath(`/company/users/${id}`);
    return null;
  });
}

export async function resendInviteAction(id: string): Promise<ActionResult<null>> {
  return toActionResult(async () => {
    await authorizeAction("users:manage", ["garage"]);
    await resendInvite(id);
    return null;
  });
}
