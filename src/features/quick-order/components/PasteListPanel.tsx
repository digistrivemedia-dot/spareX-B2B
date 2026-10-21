"use client";

import { ChevronDown, ClipboardPaste } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Textarea } from "@/components/ui/textarea";
import { getProductsByPartNumber } from "@/features/catalog/api";
import type { OrderLineDraft } from "@/features/quick-order/types";
import { normalisePartNumber, parsePastedList } from "@/features/quick-order/utils";
import { getErrorMessage } from "@/lib/api-client";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

const EXAMPLE = "MOT-104092, 24\nBSH-UR5DC, 50\nRLN-BS-1105 20";

type PasteListPanelProps = {
  onLinesReady: (lines: Omit<OrderLineDraft, "id">[]) => void;
};

/** Turns a pasted "part number, quantity" list into rows, matched against the catalogue. */
export function PasteListPanel({ onLinesReady }: PasteListPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);
  const panelId = useId();

  async function handleCheck() {
    const pasted = parsePastedList(text);
    if (pasted.length === 0) return setError("Paste at least one line, e.g. MOT-104092, 24");

    setIsChecking(true);
    try {
      const found = await getProductsByPartNumber(pasted.map((line) => line.partNumber));
      const byPartNumber = new Map(found.map((p) => [normalisePartNumber(p.partNumber), p]));
      const lines = pasted.map(({ partNumber, quantity }) => {
        const product = byPartNumber.get(normalisePartNumber(partNumber));
        return product
          ? { query: product.partNumber, product, quantity }
          : { query: partNumber, product: null, quantity, isUnmatched: true };
      });
      onLinesReady(lines);

      const unmatched = lines.filter((line) => !line.product).length;
      toast.success(`${formatCount(lines.length, "line")} added`, {
        description: unmatched
          ? `${formatCount(unmatched, "part number")} not found: check the rows marked in red.`
          : undefined,
      });
      setText("");
      setError(undefined);
      setIsOpen(false);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <h2>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ClipboardPaste aria-hidden className="size-4 text-navy-700" />
          <span className="flex-1">
            <span className="block text-sm font-semibold text-gray-900">Paste a list</span>
            <span className="block text-xs text-gray-500">
              One part number and quantity per line, straight from Excel or WhatsApp
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn("size-4 text-gray-500 transition-transform", isOpen && "rotate-180")}
          />
        </button>
      </h2>
      {isOpen && (
        <div id={panelId} className="flex flex-col gap-3 border-t border-gray-100 px-4 py-4">
          <label htmlFor={`${panelId}-text`} className="sr-only">
            Part numbers and quantities, one per line
          </label>
          <Textarea
            id={`${panelId}-text`}
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={6}
            placeholder={EXAMPLE}
            aria-invalid={Boolean(error)}
            className="font-mono text-sm"
            spellCheck={false}
          />
          <FieldError>{error}</FieldError>
          <div className="flex flex-wrap gap-2">
            <SubmitButton
              type="button"
              isPending={isChecking}
              onClick={handleCheck}
              variant="secondary"
            >
              Check and add rows
            </SubmitButton>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
