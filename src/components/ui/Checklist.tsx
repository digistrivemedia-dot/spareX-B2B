"use client";

import { Checkbox } from "@/components/ui/checkbox";

type ChecklistProps = {
  /** Prefix for the checkbox ids, so two lists can share a page. */
  id: string;
  items: { label: string; checked: boolean }[];
  onToggle: (index: number, checked: boolean) => void;
};

/** Large tick boxes, one per line, easy to tap with gloves on in the workshop. */
export function Checklist({ id, items, onToggle }: ChecklistProps) {
  return (
    <ul className="flex flex-col divide-y divide-gray-100">
      {items.map((item, index) => (
        <li key={item.label}>
          <label
            htmlFor={`${id}-${index}`}
            className="flex min-h-12 cursor-pointer items-center gap-3 py-2 text-sm text-gray-900"
          >
            <Checkbox
              id={`${id}-${index}`}
              checked={item.checked}
              onCheckedChange={(checked) => onToggle(index, checked === true)}
              className="size-6"
            />
            {item.label}
          </label>
        </li>
      ))}
    </ul>
  );
}
