import { requireSession } from "@/features/auth/session";
import { getStatement } from "@/features/credit/api";
import { parseDateRange } from "@/lib/search-params";
import { formatDate } from "@/lib/format";

const rupees = (paise: number) => (paise ? (paise / 100).toFixed(2) : "");
const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;

/** The account statement as a CSV file that opens in Excel. */
export async function GET(request: Request) {
  await requireSession();
  const { from, to } = parseDateRange(Object.fromEntries(new URL(request.url).searchParams));
  const statement = await getStatement({ from, to });

  const rows = [
    ["Date", "Type", "Reference", "Description", "Debit (₹)", "Credit (₹)", "Balance (₹)"],
    ["", "", "", "Opening balance", "", "", rupees(statement.openingBalanceInPaise)],
    ...statement.entries.map((entry) => [
      formatDate(entry.date),
      entry.type.replace("_", " "),
      entry.reference,
      entry.description,
      rupees(entry.debitInPaise),
      rupees(entry.creditInPaise),
      (entry.balanceInPaise / 100).toFixed(2),
    ]),
    ["", "", "", "Closing balance", "", "", rupees(statement.closingBalanceInPaise)],
  ];
  // The byte-order mark tells Excel the file is UTF-8, so ₹ shows correctly.
  const csv = `﻿${rows.map((row) => row.map(cell).join(",")).join("\r\n")}`;
  const period = [from, to].filter(Boolean).join("-to-") || "all";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sparex-statement-${period}.csv"`,
    },
  });
}
