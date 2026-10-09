import { StatusBadge } from "@/components/ui/StatusBadge";
import { getStockStatus } from "@/features/catalog/utils";
import { formatNumber } from "@/lib/format";

const LABELS = {
  in_stock: "In stock",
  low_stock: "Low",
  out_of_stock: "Out of stock",
};

/** "In stock · 240", "Low · 8" or "Out of stock", for the selected delivery branch. */
export function StockStatus({ quantity }: { quantity: number }) {
  const status = getStockStatus(quantity);
  return (
    <StatusBadge status={status}>
      {LABELS[status]}
      {quantity > 0 && <span className="tabular-nums"> · {formatNumber(quantity)}</span>}
    </StatusBadge>
  );
}
