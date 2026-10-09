import type { BikeModel } from "@/features/catalog/types";

/** Every compatible bike, grouped by make. */
export function BikeFitment({ bikes }: { bikes: BikeModel[] }) {
  if (bikes.length === 0) {
    return <p className="text-sm text-gray-700">Universal: fits any two-wheeler.</p>;
  }

  const modelsByMake = new Map<string, BikeModel[]>();
  for (const bike of bikes)
    modelsByMake.set(bike.brand, [...(modelsByMake.get(bike.brand) ?? []), bike]);

  return (
    <dl className="flex flex-col gap-2 text-sm">
      {[...modelsByMake].map(([make, models]) => (
        <div key={make} className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <dt className="w-28 shrink-0 font-medium text-gray-900">{make}</dt>
          <dd className="flex flex-wrap gap-1.5">
            {models.map((bike) => (
              <span
                key={bike.id}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {bike.model}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
