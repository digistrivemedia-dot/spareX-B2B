"use client";

import { Plus } from "lucide-react";
import { flushSync } from "react-dom";

import { Button } from "@/components/ui/button";
import type { Product } from "@/features/catalog/types";
import { LINE_COLUMNS } from "@/features/quick-order/components/line-columns";
import { OrderLineRow } from "@/features/quick-order/components/OrderLineRow";
import type { CheckedLine } from "@/features/quick-order/types";
import type { OrderLinesState } from "@/features/quick-order/use-order-lines";
import { cn } from "@/lib/utils";

const HEADINGS = [
  { label: "Part number", column: LINE_COLUMNS.part },
  { label: "Part", column: LINE_COLUMNS.product },
  { label: "Stock", column: LINE_COLUMNS.stock },
  { label: "Unit price", column: LINE_COLUMNS.price },
  { label: "Quantity", column: LINE_COLUMNS.quantity },
  { label: "Line total", column: LINE_COLUMNS.total },
  { label: "", column: LINE_COLUMNS.remove },
];

const focusField = (id: string) => document.getElementById(id)?.focus();

/**
 * The editable rows of a quick order: pick a part, set the quantity, Enter for the next row.
 * Prices are excl. GST and stock is for the selected delivery branch.
 */
type OrderLineListProps = {
  state: OrderLinesState;
  /** The same rows as `state.lines`, with stock and status worked out. */
  checkedLines: CheckedLine[];
};

export function OrderLineList({ state, checkedLines }: OrderLineListProps) {
  const { lines } = state;

  function selectProduct(lineId: string, product: Product) {
    // Render the quantity box first, then move into it.
    flushSync(() => state.selectProduct(lineId, product));
    focusField(`qty-${lineId}`);
  }

  function goToNextRow(lineId: string) {
    const index = lines.findIndex((line) => line.id === lineId);
    const next = lines[index + 1];
    const nextId = next ? next.id : flushSync(() => state.addLine());
    focusField(`part-${nextId}`);
  }

  function addRow() {
    focusField(`part-${flushSync(() => state.addLine())}`);
  }

  return (
    <div className="@container rounded-xl border border-gray-200 bg-white shadow-sm">
      <div
        aria-hidden
        className={cn(
          LINE_COLUMNS.row,
          "hidden rounded-t-xl border-b border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-500 @4xl:flex",
        )}
      >
        {HEADINGS.map(({ label, column }) => (
          <span key={label || "remove"} className={column}>
            {label}
          </span>
        ))}
      </div>
      <ol aria-label="Order lines">
        {checkedLines.map(({ line, stock, check }, index) => {
          return (
            <OrderLineRow
              key={line.id}
              line={line}
              position={index + 1}
              stock={stock}
              check={check}
              onQueryChange={(query) => state.setQuery(line.id, query)}
              onSelectProduct={(product) => selectProduct(line.id, product)}
              onQuantityChange={(quantity) => state.setQuantity(line.id, quantity)}
              onNext={() => goToNextRow(line.id)}
              onRemove={() => state.removeLine(line.id)}
            />
          );
        })}
      </ol>
      <div className="border-t border-gray-100 px-4 py-3">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus aria-hidden />
          Add row
        </Button>
      </div>
    </div>
  );
}
