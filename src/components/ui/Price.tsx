import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceProps = {
  amountInPaise: number;
  /** Every amount says whether GST is in it. */
  gst: "excl" | "incl";
  className?: string;
};

/** "₹1,24,999 excl. GST": money with its GST label, in tabular figures. */
export function Price({ amountInPaise, gst, className }: PriceProps) {
  return (
    <span className={cn("whitespace-nowrap", className)}>
      <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(amountInPaise)}</span>{" "}
      <span className="text-xs font-normal text-gray-500">{gst}. GST</span>
    </span>
  );
}
