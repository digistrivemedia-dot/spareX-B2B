import type { VehicleModel } from "@/features/catalog/types";
import { VEHICLE_TYPE_LABELS } from "@/features/catalog/utils";

/** Every compatible vehicle, grouped by type and make, e.g. "Car · Maruti Suzuki: Swift, Baleno". */
export function VehicleFitment({ vehicles }: { vehicles: VehicleModel[] }) {
  if (vehicles.length === 0) {
    return <p className="text-sm text-gray-700">Universal: fits any vehicle.</p>;
  }

  const modelsByMake = new Map<string, VehicleModel[]>();
  for (const vehicle of vehicles) {
    const key = `${VEHICLE_TYPE_LABELS[vehicle.type]} · ${vehicle.brand}`;
    modelsByMake.set(key, [...(modelsByMake.get(key) ?? []), vehicle]);
  }

  return (
    <dl className="flex flex-col gap-2 text-sm">
      {[...modelsByMake].map(([make, models]) => (
        <div key={make} className="flex flex-col gap-1">
          <dt className="font-medium text-gray-900">{make}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {models.map((vehicle) => (
              <span
                key={vehicle.id}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {vehicle.model}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
