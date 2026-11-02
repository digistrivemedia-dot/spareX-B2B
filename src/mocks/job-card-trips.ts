import type { JobCard, StaffRef } from "@/features/job-cards/types";
import { ApiError } from "@/lib/api-client";
import { companyUsers } from "@/mocks/company";
import { advanceJob, jobCards, requireJob } from "@/mocks/job-cards";
import { simulateLatency } from "@/mocks/utils";

/** Everyone active at the branch, with how many trips each is on now. Any of them can drive. */
export async function getBranchStaffMock(branchId: string) {
  await simulateLatency(200);
  return companyUsers
    .filter((user) => user.branchId === branchId && user.status === "active")
    .map((user) => ({
      id: user.id,
      name: user.name,
      activeTrips: jobCards.filter(
        (job) =>
          (job.status === "out_for_pickup" && job.pickupDrop?.pickup?.driver.id === user.id) ||
          (job.status === "out_for_delivery" && job.pickupDrop?.drop?.driver.id === user.id),
      ).length,
    }));
}

/**
 * Sends a driver to fetch the vehicle (once the booking is confirmed) or take it back (once it's
 * billed; the customer pays online first, or the driver collects cash at the door).
 */
export async function assignDriverMock(
  id: string,
  trip: "pickup" | "drop",
  driverId: string,
): Promise<JobCard> {
  await simulateLatency(500);
  const job = requireJob(id);
  if (!job.pickupDrop) throw new ApiError(409, { message: "This job has no pick-up & drop." });
  const user = companyUsers.find((candidate) => candidate.id === driverId);
  if (!user || user.branchId !== job.branch.id || user.status !== "active") {
    throw new ApiError(422, { message: "Choose someone from this branch." });
  }
  const driver: StaffRef = { id: user.id, name: user.name };
  const assignedAt = new Date().toISOString();
  if (trip === "pickup") {
    advanceJob(job, ["confirmed"], "out_for_pickup", `${driver.name} is picking it up`);
    job.pickupDrop.pickup = { driver, assignedAt };
  } else {
    advanceJob(
      job,
      ["payment_pending", "paid"],
      "out_for_delivery",
      `${driver.name} is delivering it`,
    );
    job.pickupDrop.drop = { driver, assignedAt };
  }
  return job;
}
