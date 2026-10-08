import type { Branch, Business, CompanyUser, FleetVehicle } from "@/features/company/types";
import { bikeModels } from "@/mocks/catalog";
import { daysFromToday, findById, simulateLatency } from "@/mocks/utils";

export const business: Business = {
  id: "biz-ssw",
  name: "Sri Sai Two Wheeler Works",
  type: "garage",
  gstin: "29AAKFS4821M1Z3",
  pan: "AAKFS4821M",
  email: "accounts@srisaiworks.example.com",
  phone: "+919886044120",
  registeredAddress: {
    line1: "No. 14, 2nd Cross, ITPL Main Road",
    line2: "Opp. Brookefield Mall, Kundalahalli",
    city: "Bengaluru",
    state: "Karnataka",
    pin: "560037",
  },
  approvedAt: "2026-03-18T10:30:00.000Z",
};

export const branches: Branch[] = [
  {
    id: "br-whitefield",
    name: "Whitefield",
    isMain: true,
    address: {
      line1: "No. 14, 2nd Cross, ITPL Main Road",
      line2: "Opp. Brookefield Mall, Kundalahalli",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560037",
    },
    contactName: "Mahesh Kumar",
    contactPhone: "+919886044120",
  },
  {
    id: "br-hsr",
    name: "HSR Layout",
    isMain: false,
    address: {
      line1: "No. 1187, 24th Main Road, Sector 2",
      line2: "Near Agara Lake signal",
      city: "Bengaluru",
      state: "Karnataka",
      pin: "560102",
    },
    contactName: "Ravi Shankar",
    contactPhone: "+919845213367",
  },
];

export const companyUsers: CompanyUser[] = [
  {
    id: "usr-mahesh",
    name: "Mahesh Kumar",
    email: "mahesh@srisaiworks.example.com",
    phone: "+919886044120",
    role: "owner",
    status: "active",
    lastActiveAt: daysFromToday(0, 9, 12),
  },
  {
    id: "usr-ravi",
    name: "Ravi Shankar",
    email: "ravi@srisaiworks.example.com",
    phone: "+919845213367",
    role: "manager",
    status: "active",
    lastActiveAt: daysFromToday(-1, 18, 40),
  },
  {
    id: "usr-shilpa",
    name: "Shilpa Rao",
    email: "shilpa@srisaiworks.example.com",
    phone: "+919741088254",
    role: "accountant",
    status: "invited",
  },
];

export const fleetVehicles: FleetVehicle[] = [
  {
    id: "veh-1",
    registrationNumber: "KA 53 EX 4821",
    bike: findById(bikeModels, "honda-activa-6g"),
    year: 2023,
    branchId: "br-whitefield",
    odometerKm: 18420,
  },
  {
    id: "veh-2",
    registrationNumber: "KA 51 HM 7730",
    bike: findById(bikeModels, "bajaj-pulsar-150"),
    year: 2022,
    branchId: "br-whitefield",
    odometerKm: 31205,
  },
  {
    id: "veh-3",
    registrationNumber: "KA 01 JR 2196",
    bike: findById(bikeModels, "re-classic-350"),
    year: 2024,
    branchId: "br-hsr",
    odometerKm: 9640,
  },
  {
    id: "veh-4",
    registrationNumber: "KA 05 MN 6614",
    bike: findById(bikeModels, "tvs-jupiter"),
    year: 2021,
    branchId: "br-hsr",
    odometerKm: 42870,
  },
];

export async function getBranchesMock(): Promise<Branch[]> {
  await simulateLatency();
  return branches;
}
