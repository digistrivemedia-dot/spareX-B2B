"use client";

import { cva } from "class-variance-authority";

import { Input } from "@/components/ui/input";
import { PhotoUpload } from "@/components/ui/PhotoUpload";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { InspectionItem, InspectionResult } from "@/features/job-cards/types";
import { INSPECTION_RESULT_LABELS } from "@/features/job-cards/utils";

const optionVariants = cva(
  "flex h-10 cursor-pointer items-center justify-center rounded-lg border px-3 text-sm font-medium whitespace-nowrap has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
  {
    variants: {
      result: {
        ok: "has-data-[state=checked]:border-success-600 has-data-[state=checked]:bg-success-50 has-data-[state=checked]:text-success-700",
        attention:
          "has-data-[state=checked]:border-warning-500 has-data-[state=checked]:bg-warning-50 has-data-[state=checked]:text-warning-700",
        replace:
          "has-data-[state=checked]:border-danger-600 has-data-[state=checked]:bg-danger-50 has-data-[state=checked]:text-danger-700",
      },
    },
  },
);

const RESULTS = Object.keys(INSPECTION_RESULT_LABELS) as InspectionResult[];
const MAX_PHOTOS = 3;

type InspectionItemRowProps = {
  item: InspectionItem;
  onChange: (changes: Partial<InspectionItem>) => void;
};

/** One check: OK, needs attention or replace; anything not OK gets a note and photos. */
export function InspectionItemRow({ item, onChange }: InspectionItemRowProps) {
  return (
    <li className="flex flex-col gap-3 py-3 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <span className="text-sm font-medium text-gray-900">{item.name}</span>
        <RadioGroup
          aria-label={item.name}
          value={item.result}
          onValueChange={(value) => onChange({ result: value as InspectionResult })}
          className="grid grid-cols-3 gap-2"
        >
          {RESULTS.map((result) => (
            <label
              key={result}
              htmlFor={`${item.id}-${result}`}
              className={optionVariants({ result })}
            >
              <RadioGroupItem id={`${item.id}-${result}`} value={result} className="sr-only" />
              {INSPECTION_RESULT_LABELS[result]}
            </label>
          ))}
        </RadioGroup>
      </div>
      {item.result !== "ok" && (
        <div className="flex flex-col gap-3 rounded-lg bg-gray-50 p-3">
          <Input
            aria-label={`Note for ${item.name}`}
            placeholder="What did you find? e.g. Pads 2 mm, disc scored"
            value={item.note ?? ""}
            onChange={(event) => onChange({ note: event.target.value })}
          />
          <PhotoUpload
            id={`${item.id}-photos`}
            value={item.photos}
            onChange={(photos) => onChange({ photos })}
            max={MAX_PHOTOS}
            label={`${item.name} photo`}
          />
        </div>
      )}
    </li>
  );
}
