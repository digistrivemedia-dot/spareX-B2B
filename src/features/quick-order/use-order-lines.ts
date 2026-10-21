"use client";

import { useState } from "react";

import type { Product } from "@/features/catalog/types";
import type { OrderLineDraft } from "@/features/quick-order/types";

// Rows added in the browser get numbered ids. The first row has a fixed id so the server and
// the browser render the same HTML (a counter would keep counting across server requests).
const FIRST_LINE_ID = "line-first";
let lastLineId = 0;

function emptyLine(id = `line-${++lastLineId}`): OrderLineDraft {
  return { id, query: "", product: null, quantity: 0 };
}

const isBlank = (line: OrderLineDraft) => !line.product && !line.query.trim();

/**
 * The rows of a quick order or quotation request. There is always at least one row to type
 * into. `initial` rows (e.g. parts passed from the cart) get fixed ids, like the first row.
 */
export function useOrderLines(initial: Omit<OrderLineDraft, "id">[] = []) {
  const [lines, setLines] = useState<OrderLineDraft[]>(() =>
    initial.length
      ? initial.map((line, index) => ({ ...line, id: `${FIRST_LINE_ID}-${index}` }))
      : [emptyLine(FIRST_LINE_ID)],
  );

  const update = (id: string, changes: Partial<OrderLineDraft>) =>
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...changes } : line)));

  return {
    lines,

    /** Typing in the part-number box; clearing it also clears the part. */
    setQuery: (id: string, query: string) =>
      update(id, {
        query,
        isUnmatched: false,
        ...(query.trim() ? {} : { product: null, quantity: 0 }),
      }),

    selectProduct: (id: string, product: Product) =>
      update(id, {
        product,
        query: product.partNumber,
        isUnmatched: false,
        quantity: 1,
      }),

    setQuantity: (id: string, quantity: number) => update(id, { quantity }),

    /** Adds an empty row and returns its id, so the caller can focus it. */
    addLine: () => {
      const line = emptyLine();
      setLines((current) => [...current, line]);
      return line.id;
    },

    removeLine: (id: string) =>
      setLines((current) => {
        const remaining = current.filter((line) => line.id !== id);
        return remaining.length ? remaining : [emptyLine()];
      }),

    /** Adds pasted rows after the rows already filled in (empty rows are dropped). */
    appendLines: (pasted: Omit<OrderLineDraft, "id">[]) =>
      setLines((current) => [
        ...current.filter((line) => !isBlank(line)),
        ...pasted.map((line) => ({ ...line, id: emptyLine().id })),
      ]),

    /** Removes the given rows, e.g. once they are in the cart. */
    removeLines: (ids: string[]) =>
      setLines((current) => {
        const remaining = current.filter((line) => !ids.includes(line.id));
        return remaining.length ? remaining : [emptyLine()];
      }),
  };
}

export type OrderLinesState = ReturnType<typeof useOrderLines>;
