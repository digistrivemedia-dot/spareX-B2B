import type { Session } from "@/features/auth/types";
import { business, companyUsers } from "@/mocks/company";
import { findById, simulateLatency } from "@/mocks/utils";

const owner = findById(companyUsers, "usr-mahesh");

const demoSession: Session = {
  user: { id: owner.id, name: owner.name, email: owner.email, phone: owner.phone },
  business,
  role: owner.role,
  approvalStatus: "approved",
};

export async function getSessionMock(): Promise<Session | null> {
  await simulateLatency(100);
  return demoSession;
}
