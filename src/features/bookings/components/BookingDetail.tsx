import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { NumberPlate } from "@/components/ui/NumberPlate";
import { SectionCard } from "@/components/ui/SectionCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { BookingDecision } from "@/features/bookings/components/BookingDecision";
import type { Booking } from "@/features/bookings/types";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";
import { formatDateTime, formatPhone, formatPrice } from "@/lib/format";

export function BookingDetail({ booking }: { booking: Booking }) {
  const totalInPaise = booking.services.reduce((sum, service) => sum + service.priceInPaise, 0);

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <SectionCard title="Customer">
            <DetailList>
              <DetailItem label="Name">{booking.customer.name}</DetailItem>
              <DetailItem label="Mobile">{formatPhone(booking.customer.phone)}</DetailItem>
              {booking.customer.customerId && (
                <Link
                  href={`/garage/customers/${booking.customer.customerId}`}
                  className="text-sm font-medium text-navy-700 hover:underline"
                >
                  Past visits and vehicles
                </Link>
              )}
            </DetailList>
          </SectionCard>
          <SectionCard title="Vehicle">
            <DetailList>
              <div>
                <NumberPlate plate={booking.vehicle.plate} />
              </div>
              <DetailItem label="Make and model">
                {booking.vehicle.make} {booking.vehicle.model}
              </DetailItem>
              <DetailItem label="Type">{VEHICLE_TYPE_LABELS[booking.vehicle.type]}</DetailItem>
            </DetailList>
          </SectionCard>
        </div>
        <SectionCard title="Services booked">
          <ul className="divide-y divide-gray-100 text-sm">
            {booking.services.map((service) => (
              <li key={service.serviceId} className="flex justify-between gap-4 py-2 first:pt-0">
                <span className="text-gray-900">{service.name}</span>
                <span className="font-medium text-gray-900 tabular-nums">
                  {formatPrice(service.priceInPaise)}
                </span>
              </li>
            ))}
            <li className="flex justify-between gap-4 pt-2 font-semibold text-gray-900">
              <span>Total (excl. GST)</span>
              <span className="tabular-nums">{formatPrice(totalInPaise)}</span>
            </li>
          </ul>
          {booking.notes && (
            <p className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
              <span className="font-medium text-gray-900">Customer&apos;s note: </span>
              {booking.notes}
            </p>
          )}
        </SectionCard>
      </div>

      <aside className="xl:sticky xl:top-20 xl:w-80 xl:shrink-0">
        <Card>
          <CardContent className="flex flex-col gap-4 text-sm">
            <StatusBadge status={booking.status} className="self-start" />
            <DetailList>
              <DetailItem label="Slot">{formatDateTime(booking.slotAt)}</DetailItem>
              <DetailItem label="Branch">{booking.branch.name}</DetailItem>
              <DetailItem label="Booked">{formatDateTime(booking.createdAt)}</DetailItem>
            </DetailList>
            {booking.status === "new" && <BookingDecision booking={booking} />}
            {booking.status === "accepted" && booking.jobId && (
              <Link
                href={`/garage/jobs/${booking.jobId}`}
                className="font-medium text-navy-700 hover:underline"
              >
                Open the job card
              </Link>
            )}
            {booking.declineReason && (
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Declined: </span>
                {booking.declineReason}
              </p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
