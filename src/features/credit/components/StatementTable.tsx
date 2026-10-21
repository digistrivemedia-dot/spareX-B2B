"use client";

import { ScrollText } from "lucide-react";

import { DataTable } from "@/components/ui/data-table/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { statementColumns } from "@/features/credit/components/statement-columns";
import type { Statement } from "@/features/credit/types";
import { formatPrice } from "@/lib/format";

/** The statement's entries between its opening and closing balances. */
export function StatementTable({ statement }: { statement: Statement }) {
  return (
    <div className="flex flex-col gap-3">
      <BalanceLine label="Opening balance" amountInPaise={statement.openingBalanceInPaise} />
      <DataTable
        label="Account statement"
        columns={statementColumns}
        data={statement.entries}
        emptyState={
          <EmptyState
            icon={ScrollText}
            title="No entries in these dates"
            description="Choose a wider date range, or clear the dates to see everything."
          />
        }
      />
      <BalanceLine label="Closing balance" amountInPaise={statement.closingBalanceInPaise} />
    </div>
  );
}

function BalanceLine({ label, amountInPaise }: { label: string; amountInPaise: number }) {
  return (
    <p className="flex justify-between rounded-lg bg-gray-100 px-4 py-2 text-sm">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900 tabular-nums">{formatPrice(amountInPaise)}</span>
    </p>
  );
}
