import type { GarageBranch, GarageProfile } from "@/features/garage/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import {
  getGarageBranchesMock,
  getGarageProfileMock,
  updateGarageProfileMock,
} from "@/mocks/garage";

export async function getGarageProfile(): Promise<GarageProfile> {
  if (dataSource.garage === "mock") return getGarageProfileMock();
  return apiClient<GarageProfile>("/garage/profile");
}

export async function updateGarageProfile(profile: GarageProfile): Promise<GarageProfile> {
  if (dataSource.garage === "mock") return updateGarageProfileMock(profile);
  return apiClient<GarageProfile>("/garage/profile", { method: "PUT", body: profile });
}

/** The business's branches with their staff count. */
export async function getGarageBranches(): Promise<GarageBranch[]> {
  if (dataSource.garage === "mock") return getGarageBranchesMock();
  return apiClient<GarageBranch[]>("/garage/branches");
}
