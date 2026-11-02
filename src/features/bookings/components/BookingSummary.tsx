import { Truck } from "lucide-react";

import { NumberPlate } from "@/components/ui/NumberPlate";
import type { Booking } from "@/features/bookings/types";
import { formatPhone, formatPrice } from "@/lib/format";

/** Everything needed to decide on a request at a glance: vehicle, customer, work and price. */
export function BookingSummary({ booking }: { booking: Booking }) {
  const { pickupDrop } = booking;
  const totalInPaise =
    booking.services.reduce((sum, service) => sum + service.priceInPaise, 0) +
    (pickupDrop?.feeInPaise ?? 0);

  return (
    <div className="flex flex-col gap-2 text-sm">
      <span className="flex flex-wrap items-center gap-2">
        <NumberPlate plate={booking.vehicle.plate} />
        <span className="font-semibold text-gray-900">
          {booking.vehicle.make} {booking.vehicle.model}
        </span>
      </span>
      <span className="text-gray-700">
        {booking.customer.name} · {formatPhone(booking.customer.phone)}
      </span>
      {pickupDrop && (
        <span className="flex flex-col gap-1 rounded-lg bg-info-50 p-3 text-info-700">
          <span className="flex items-center gap-1.5 font-semibold">
            <Truck aria-hidden className="size-4" />
            Pick-up & drop · {formatPrice(pickupDrop.feeInPaise)}
          </span>
          <span>Pick up from {pickupDrop.pickupAddress}</span>
          {pickupDrop.dropAddress !== pickupDrop.pickupAddress && (
            <span>Drop at {pickupDrop.dropAddress}</span>
          )}
        </span>
      )}
      <span className="text-gray-700">
        {booking.services.map((service) => service.name).join(", ")}
        {pickupDrop && ", pick-up & drop"} ·{" "}
        <span className="font-semibold text-gray-900 tabular-nums">
          {formatPrice(totalInPaise)}
        </span>{" "}
        excl. GST
      </span>
      {booking.notes && <span className="text-gray-500">“{booking.notes}”</span>}
    </div>
  );
}
