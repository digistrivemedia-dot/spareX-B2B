import { FileText, ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatCount, formatPrice } from "@/lib/format";

type QuickOrderFooterProps = {
  lineCount: number;
  subtotalInPaise: number;
  /** Rows that won't go to the cart (not found or out of stock). */
  problemCount: number;
  /** Where "Request quotation" goes, with these parts filled in. */
  quotationHref: string;
  onAddAll: () => void;
};

/** Stays at the bottom of the screen: totals and the two ways to finish. */
export function QuickOrderFooter({
  lineCount,
  subtotalInPaise,
  problemCount,
  quotationHref,
  onAddAll,
}: QuickOrderFooterProps) {
  const isEmpty = lineCount === 0;

  return (
    <div className="sticky bottom-4 z-10 mt-6 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div role="status" className="flex flex-col">
        <span className="text-sm text-gray-500">
          {formatCount(lineCount, "item")} ready
          {problemCount > 0 && (
            <span className="text-danger-700">
              {" "}
              · {formatCount(problemCount, "row")} need attention
            </span>
          )}
        </span>
        <span>
          <span className="text-lg font-semibold text-gray-900 tabular-nums">
            {formatPrice(subtotalInPaise)}
          </span>{" "}
          <span className="text-xs text-gray-500">subtotal excl. GST</span>
        </span>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        {isEmpty ? (
          <Button variant="outline" disabled>
            <FileText aria-hidden />
            Request quotation for these
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <Link href={quotationHref}>
              <FileText aria-hidden />
              Request quotation for these
            </Link>
          </Button>
        )}
        <Button onClick={onAddAll} disabled={isEmpty}>
          <ShoppingCart aria-hidden />
          Add all to cart
        </Button>
      </div>
    </div>
  );
}
