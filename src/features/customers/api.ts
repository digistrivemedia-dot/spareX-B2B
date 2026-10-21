import type {
  Customer,
  CustomerDetail,
  CustomerFilters,
  CustomerSummary,
  CustomerVehicle,
  NewCustomerRequest,
} from "@/features/customers/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import { addCustomerMock, getCustomerMock, getCustomersMock } from "@/mocks/customer-handlers";
import { findVehicleByPlateMock } from "@/mocks/customers";

export type VehicleLookup = { vehicle: CustomerVehicle; customer: Customer } | null;

/** The vehicle on file with this number plate (spaces and case don't matter), with its owner. */
export async function findVehicleByPlate(plate: string): Promise<VehicleLookup> {
  if (dataSource.customers === "mock") return findVehicleByPlateMock(plate);
  return apiClient<VehicleLookup>("/garage/vehicles/lookup", { query: { plate } });
}

/** The garage's customers, most recent visit first. */
export async function getCustomers(
  filters: CustomerFilters = {},
): Promise<Paginated<CustomerSummary>> {
  if (dataSource.customers === "mock") return getCustomersMock(filters);
  return apiClient<Paginated<CustomerSummary>>("/garage/customers", { query: filters });
}

/** A customer with every vehicle's service history, or null if there is none. */
export async function getCustomer(id: string): Promise<CustomerDetail | null> {
  if (dataSource.customers === "mock") return getCustomerMock(id);
  return apiClient<CustomerDetail | null>(`/garage/customers/${id}`);
}

export async function addCustomer(request: NewCustomerRequest): Promise<{ id: string }> {
  if (dataSource.customers === "mock") return addCustomerMock(request);
  return apiClient<{ id: string }>("/garage/customers", { method: "POST", body: request });
}
