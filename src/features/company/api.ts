import { cache } from "react";

import type {
  Branch,
  BranchInput,
  Business,
  BusinessContactUpdate,
  CompanyUser,
  CompanyUserFilters,
  CompanyUserInput,
  PincodeDetails,
} from "@/features/company/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import {
  createBranchMock,
  createCompanyUserMock,
  deleteBranchMock,
  getBranchesMock,
  getCompanyUserMock,
  getCompanyUsersMock,
  lookupPincodeMock,
  resendInviteMock,
  setCompanyUserStatusMock,
  setMainBranchMock,
  updateBranchMock,
  updateBusinessContactMock,
  updateCompanyUserMock,
} from "@/mocks/company";

/** Cached per request: the top bar and the page both need the branches. */
export const getBranches = cache(async (): Promise<Branch[]> => {
  if (dataSource.company === "mock") return getBranchesMock();
  return apiClient<Branch[]>("/company/branches");
});

/** City and state for a PIN code, or null when it isn't recognised. */
export async function lookupPincode(pin: string): Promise<PincodeDetails | null> {
  if (dataSource.company === "mock") return lookupPincodeMock(pin);
  return apiClient<PincodeDetails | null>(`/pincodes/${pin}`);
}

export async function createBranch(input: BranchInput): Promise<Branch> {
  if (dataSource.company === "mock") return createBranchMock(input);
  return apiClient<Branch>("/company/branches", { method: "POST", body: input });
}

export async function updateBranch(id: string, input: BranchInput): Promise<Branch> {
  if (dataSource.company === "mock") return updateBranchMock(id, input);
  return apiClient<Branch>(`/company/branches/${id}`, { method: "PUT", body: input });
}

export async function deleteBranch(id: string): Promise<void> {
  if (dataSource.company === "mock") return deleteBranchMock(id);
  return apiClient<void>(`/company/branches/${id}`, { method: "DELETE" });
}

/** The main branch is the default delivery address. */
export async function setMainBranch(id: string): Promise<void> {
  if (dataSource.company === "mock") return setMainBranchMock(id);
  return apiClient<void>(`/company/branches/${id}/main`, { method: "POST" });
}

export async function updateBusinessContact(update: BusinessContactUpdate): Promise<Business> {
  if (dataSource.company === "mock") return updateBusinessContactMock(update);
  return apiClient<Business>("/company/profile", { method: "PATCH", body: update });
}

export async function getCompanyUsers(
  filters: CompanyUserFilters = {},
): Promise<Paginated<CompanyUser>> {
  if (dataSource.company === "mock") return getCompanyUsersMock(filters);
  return apiClient<Paginated<CompanyUser>>("/company/users", { query: filters });
}

/** One user, or null if there is none. */
export async function getCompanyUser(id: string): Promise<CompanyUser | null> {
  if (dataSource.company === "mock") return getCompanyUserMock(id);
  return apiClient<CompanyUser | null>(`/company/users/${id}`);
}

/** Adds a user and emails them an invitation to set their password. */
export async function createCompanyUser(input: CompanyUserInput): Promise<CompanyUser> {
  if (dataSource.company === "mock") return createCompanyUserMock(input);
  return apiClient<CompanyUser>("/company/users", { method: "POST", body: input });
}

export async function updateCompanyUser(id: string, input: CompanyUserInput): Promise<CompanyUser> {
  if (dataSource.company === "mock") return updateCompanyUserMock(id, input);
  return apiClient<CompanyUser>(`/company/users/${id}`, { method: "PUT", body: input });
}

export async function setCompanyUserStatus(
  id: string,
  status: "active" | "disabled",
): Promise<CompanyUser> {
  if (dataSource.company === "mock") return setCompanyUserStatusMock(id, status);
  return apiClient<CompanyUser>(`/company/users/${id}/status`, {
    method: "POST",
    body: { status },
  });
}

export async function resendInvite(id: string): Promise<void> {
  if (dataSource.company === "mock") return resendInviteMock(id);
  return apiClient<void>(`/company/users/${id}/invite`, { method: "POST" });
}
