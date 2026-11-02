import { DetailItem, DetailList } from "@/components/ui/DetailList";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PickupDrop, Trip } from "@/features/job-cards/types";
import { formatDateTime, formatPrice } from "@/lib/format";

/** Where a trip stands: not sent yet, on the road with whom, or done and when. */
function tripText(trip: Trip | undefined, doneWord: string): string {
  if (!trip) return "No driver yet";
  if (trip.doneAt) return `${doneWord} by ${trip.driver.name}, ${formatDateTime(trip.doneAt)}`;
  return `${trip.driver.name} is on the way (sent ${formatDateTime(trip.assignedAt)})`;
}

/** The customer asked the garage to fetch the vehicle and bring it back. */
export function PickupDropSection({
  pickupDrop,
  isDone,
}: {
  pickupDrop: PickupDrop;
  isDone: boolean;
}) {
  const sameAddress = pickupDrop.pickupAddress === pickupDrop.dropAddress;
  return (
    <SectionCard title="Pick-up & drop" isDone={isDone}>
      <div className="grid gap-4 sm:grid-cols-2">
        <DetailList>
          <DetailItem label={sameAddress ? "Pick up from and drop at" : "Pick up from"}>
            {pickupDrop.pickupAddress}
          </DetailItem>
          {!sameAddress && <DetailItem label="Drop at">{pickupDrop.dropAddress}</DetailItem>}
          <DetailItem label="Fee">
            {formatPrice(pickupDrop.feeInPaise)} excl. GST, on the bill
          </DetailItem>
        </DetailList>
        <DetailList>
          <DetailItem label="Pick-up">{tripText(pickupDrop.pickup, "Picked up")}</DetailItem>
          <DetailItem label="Delivery">{tripText(pickupDrop.drop, "Delivered")}</DetailItem>
        </DetailList>
      </div>
    </SectionCard>
  );
}
