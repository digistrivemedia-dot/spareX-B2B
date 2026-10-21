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
import { ApiError } from "@/lib/api-client";
import type { Paginated } from "@/lib/types";
import { daysFromToday, paginate, simulateLatency } from "@/mocks/utils";

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
  photos: ["/images/garage/workshop-1.jpg", "/images/garage/workshop-3.jpg"],
  documents: [],
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

function requireBranch(id: string): Branch {
  const branch = branches.find((candidate) => candidate.id === id);
  if (!branch) throw new ApiError(404, { message: "We couldn't find that branch." });
  return branch;
}

export async function createBranchMock(input: BranchInput): Promise<Branch> {
  await simulateLatency(600);
  const created: Branch = { ...input, id: `br-${Date.now()}`, isMain: false };
  branches.push(created);
  return created;
}

export async function updateBranchMock(id: string, input: BranchInput): Promise<Branch> {
  await simulateLatency(600);
  return Object.assign(requireBranch(id), input);
}

/** The main branch is the default delivery address and can't be removed. */
export async function deleteBranchMock(id: string): Promise<void> {
  await simulateLatency(500);
  if (requireBranch(id).isMain) {
    throw new ApiError(409, { message: "Make another branch the main one before removing this." });
  }
  if (companyUsers.some((user) => user.branchId === id && user.status !== "disabled")) {
    throw new ApiError(409, { message: "Move this branch's staff to another branch first." });
  }
  branches.splice(branches.indexOf(requireBranch(id)), 1);
}

export async function setMainBranchMock(id: string): Promise<void> {
  await simulateLatency(400);
  requireBranch(id);
  for (const branch of branches) branch.isMain = branch.id === id;
}

export async function updateBusinessContactMock(update: BusinessContactUpdate): Promise<Business> {
  await simulateLatency(600);
  return Object.assign(business, update);
}

export async function getCompanyUsersMock({
  role,
  branchId,
  page,
  pageSize,
}: CompanyUserFilters): Promise<Paginated<CompanyUser>> {
  await simulateLatency();
  const matching = companyUsers.filter(
    (user) => (!role || user.roles.includes(role)) && (!branchId || user.branchId === branchId),
  );
  return paginate(matching, page, pageSize);
}

export async function getCompanyUserMock(id: string): Promise<CompanyUser | null> {
  await simulateLatency();
  return companyUsers.find((user) => user.id === id) ?? null;
}

function requireUser(id: string): CompanyUser {
  const user = companyUsers.find((candidate) => candidate.id === id);
  if (!user) throw new ApiError(404, { message: "We couldn't find that user." });
  return user;
}

function assertEmailFree(email: string, exceptId?: string) {
  const taken = companyUsers.some(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.id !== exceptId,
  );
  if (taken) throw new ApiError(409, { message: "Someone on your team already uses this email." });
}

/** There must always be an active owner who can manage the account. */
function assertKeepsAnOwner(changed: CompanyUser) {
  const owners = companyUsers
    .map((user) => (user.id === changed.id ? changed : user))
    .filter((user) => user.roles.includes("owner") && user.status === "active");
  if (owners.length === 0) {
    throw new ApiError(409, { message: "Keep at least one active Owner / admin on the account." });
  }
}

/** New users get an email invitation to set their password. */
export async function createCompanyUserMock(input: CompanyUserInput): Promise<CompanyUser> {
  await simulateLatency(700);
  assertEmailFree(input.email);
  const created: CompanyUser = { ...input, id: `usr-${Date.now()}`, status: "invited" };
  companyUsers.push(created);
  return created;
}

export async function updateCompanyUserMock(
  id: string,
  input: CompanyUserInput,
): Promise<CompanyUser> {
  await simulateLatency(700);
  const user = requireUser(id);
  assertEmailFree(input.email, id);
  assertKeepsAnOwner({ ...user, ...input });
  return Object.assign(user, input);
}

export async function setCompanyUserStatusMock(
  id: string,
  status: "active" | "disabled",
): Promise<CompanyUser> {
  await simulateLatency(500);
  const user = requireUser(id);
  // A disabled user who never accepted the invite goes back to "invited" when re-enabled.
  const next = status === "active" && !user.lastActiveAt ? "invited" : status;
  assertKeepsAnOwner({ ...user, status: next });
  return Object.assign(user, { status: next });
}

export async function resendInviteMock(id: string): Promise<void> {
  await simulateLatency(500);
  if (requireUser(id).status !== "invited") {
    throw new ApiError(409, { message: "This user has already accepted their invitation." });
  }
}
