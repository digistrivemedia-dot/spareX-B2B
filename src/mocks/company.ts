import type { Branch, Business, CompanyUser, PincodeDetails } from "@/features/company/types";
import { daysFromToday, simulateLatency } from "@/mocks/utils";

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
  discountPercent: 15,
  creditEnabled: true,
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
    roles: ["owner"],
    branchId: "br-whitefield",
    status: "active",
    lastActiveAt: daysFromToday(0, 9, 12),
  },
  {
    id: "usr-ravi",
    name: "Ravi Shankar",
    email: "ravi@srisaiworks.example.com",
    phone: "+919845213367",
    roles: ["manager"],
    branchId: "br-hsr",
    status: "active",
    lastActiveAt: daysFromToday(-1, 18, 40),
  },
  {
    id: "usr-shilpa",
    name: "Shilpa Rao",
    email: "shilpa@srisaiworks.example.com",
    phone: "+919741088254",
    roles: ["billing"],
    branchId: "br-whitefield",
    status: "active",
    lastActiveAt: daysFromToday(0, 10, 25),
  },
  {
    id: "usr-imran",
    name: "Imran Pasha",
    email: "imran@srisaiworks.example.com",
    phone: "+919900317746",
    roles: ["technician"],
    branchId: "br-whitefield",
    status: "active",
    lastActiveAt: daysFromToday(0, 8, 50),
  },
  {
    id: "usr-venkatesh",
    name: "Venkatesh Gowda",
    email: "venkatesh@srisaiworks.example.com",
    phone: "+919632045518",
    roles: ["technician", "spares"],
    branchId: "br-hsr",
    status: "active",
    lastActiveAt: daysFromToday(0, 9, 35),
  },
  {
    id: "usr-deepa",
    name: "Deepa Nair",
    email: "deepa@srisaiworks.example.com",
    phone: "+919535872209",
    roles: ["spares"],
    branchId: "br-whitefield",
    status: "invited",
  },
];

export async function getBranchesMock(): Promise<Branch[]> {
  await simulateLatency();
  return branches;
}

/** Cities by the first three digits of the PIN code: enough for a realistic demo. */
const CITIES_BY_PIN_PREFIX: Record<string, { city: string; state: string }> = {
  "110": { city: "New Delhi", state: "Delhi" },
  "226": { city: "Lucknow", state: "Uttar Pradesh" },
  "302": { city: "Jaipur", state: "Rajasthan" },
  "380": { city: "Ahmedabad", state: "Gujarat" },
  "400": { city: "Mumbai", state: "Maharashtra" },
  "411": { city: "Pune", state: "Maharashtra" },
  "500": { city: "Hyderabad", state: "Telangana" },
  "530": { city: "Visakhapatnam", state: "Andhra Pradesh" },
  "560": { city: "Bengaluru", state: "Karnataka" },
  "562": { city: "Bengaluru Rural", state: "Karnataka" },
  "570": { city: "Mysuru", state: "Karnataka" },
  "575": { city: "Mangaluru", state: "Karnataka" },
  "580": { city: "Hubballi", state: "Karnataka" },
  "590": { city: "Belagavi", state: "Karnataka" },
  "600": { city: "Chennai", state: "Tamil Nadu" },
  "641": { city: "Coimbatore", state: "Tamil Nadu" },
  "682": { city: "Kochi", state: "Kerala" },
  "695": { city: "Thiruvananthapuram", state: "Kerala" },
  "700": { city: "Kolkata", state: "West Bengal" },
  "751": { city: "Bhubaneswar", state: "Odisha" },
};

export async function lookupPincodeMock(pin: string): Promise<PincodeDetails | null> {
  await simulateLatency(200);
  const match = CITIES_BY_PIN_PREFIX[pin.slice(0, 3)];
  return match ? { pin, ...match } : null;
}
