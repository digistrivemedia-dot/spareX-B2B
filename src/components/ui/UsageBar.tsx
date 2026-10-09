import { cva } from "class-variance-authority";
import type { CSSProperties } from "react";

const fillVariants = cva("h-full w-(--usage) rounded-full", {
  variants: {
    tone: {
      normal: "bg-navy-700",
      high: "bg-warning-500",
      critical: "bg-danger-600",
    },
  },
});

type UsageBarProps = {
  used: number;
  limit: number;
  /** Accessible name, e.g. "Credit used". */
  label: string;
};

/** A thin bar showing how much of a limit is used; it turns amber at 75% and red at 90%. */
export function UsageBar({ used, limit, label }: UsageBarProps) {
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = percent >= 90 ? "critical" : percent >= 75 ? "high" : "normal";

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuenow={used}
      aria-valuetext={`${percent}% used`}
      className="h-2 w-full overflow-hidden rounded-full bg-gray-100"
    >
      {/* The width is the one truly dynamic value, so it is passed as a CSS variable. */}
      <div
        className={fillVariants({ tone })}
        style={{ "--usage": `${percent}%` } as CSSProperties}
      />
    </div>
  );
}
