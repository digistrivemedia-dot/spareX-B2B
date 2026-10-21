import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { scopeToBranch } from "@/features/auth/permissions";
import { requirePermission } from "@/features/auth/session";
import { getBooking } from "@/features/bookings/api";
import { BookingDetail } from "@/features/bookings/components/BookingDetail";

type BookingPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
  const booking = await getBooking((await params).id);
  return { title: booking ? `Booking ${booking.number}` : "Booking not found" };
}

export default async function BookingPage({ params }: BookingPageProps) {
  const session = await requirePermission("bookings:manage", ["garage"]);
  const booking = await getBooking((await params).id);
  const branchId = scopeToBranch(session);
  // Staff can only open their own branch's bookings.
  if (!booking || (branchId && booking.branch.id !== branchId)) notFound();

  return (
    <>
      <PageHeader
        title={booking.number}
        description={`${booking.customer.name} · ${booking.vehicle.make} ${booking.vehicle.model}`}
      />
      <BookingDetail booking={booking} />
    </>
  );
}
