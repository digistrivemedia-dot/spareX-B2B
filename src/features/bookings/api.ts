import type { Booking, BookingFilters } from "@/features/bookings/types";
import type { JobCard } from "@/features/job-cards/types";
import { apiClient } from "@/lib/api-client";
import { dataSource } from "@/lib/config";
import type { Paginated } from "@/lib/types";
import {
  acceptBookingMock,
  declineBookingMock,
  getBookingMock,
  getBookingsMock,
} from "@/mocks/bookings";

export async function getBookings(filters: BookingFilters = {}): Promise<Paginated<Booking>> {
  if (dataSource.bookings === "mock") return getBookingsMock(filters);
  return apiClient<Paginated<Booking>>("/garage/bookings", { query: filters });
}

/** One booking, or null if there is none. */
export async function getBooking(id: string): Promise<Booking | null> {
  if (dataSource.bookings === "mock") return getBookingMock(id);
  return apiClient<Booking | null>(`/garage/bookings/${id}`);
}

/** Confirms the slot; returns the job card opened for it. */
export async function acceptBooking(id: string): Promise<JobCard> {
  if (dataSource.bookings === "mock") return acceptBookingMock(id);
  return apiClient<JobCard>(`/garage/bookings/${id}/accept`, { method: "POST" });
}

export async function declineBooking(id: string, reason: string): Promise<Booking> {
  if (dataSource.bookings === "mock") return declineBookingMock(id, reason);
  return apiClient<Booking>(`/garage/bookings/${id}/decline`, {
    method: "POST",
    body: { reason },
  });
}
