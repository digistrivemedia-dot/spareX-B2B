import type { Customer, CustomerVehicle } from "@/features/customers/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import { findVehicleByPlateMock } from "@/mocks/customers";

export type VehicleLookup = { vehicle: CustomerVehicle; customer: Customer } | null;

/** The vehicle on file with this number plate (spaces and case don't matter), with its owner. */
export async function findVehicleByPlate(plate: string): Promise<VehicleLookup> {
  if (dataSource.customers === "mock") return findVehicleByPlateMock(plate);
  return apiClient<VehicleLookup>("/garage/vehicles/lookup", { query: { plate } });
}
