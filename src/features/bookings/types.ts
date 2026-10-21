import type { VehicleType } from "@/features/catalog/types";
import type { BranchRef } from "@/features/company/types";
import type { ListParams } from "@/lib/types";

/** Bookings come from customers on the SpareX app; the garage accepts or declines them. */
export type BookingStatus = "new" | "accepted" | "declined";

export type BookedService = {
  serviceId: string;
  name: string;
  /** The garage's price when booked, excluding GST. */
  priceInPaise: number;
};

export type Booking = {
  id: string;
  number: string;
  status: BookingStatus;
  branch: BranchRef;
  createdAt: string;
  /** The day and time the customer chose. */
  slotAt: string;
  customer: { name: string; phone: string; customerId?: string };
  vehicle: { plate: string; type: VehicleType; make: string; model: string; vehicleId?: string };
  services: BookedService[];
  notes?: string;
  declineReason?: string;
  /** The job card made when the booking was accepted. */
  jobId?: string;
};

export type BookingFilters = ListParams<"slotAt"> & {
  status?: BookingStatus;
  branchId?: string;
  /** "YYYY-MM-DD": bookings for this day only. */
  date?: string;
};
