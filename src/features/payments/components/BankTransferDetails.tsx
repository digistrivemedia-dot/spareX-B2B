import { KANNALI_BANK_ACCOUNT } from "@/features/payments/bank-account";

const DETAILS = [
  { label: "Account name", value: KANNALI_BANK_ACCOUNT.accountName },
  { label: "Bank", value: KANNALI_BANK_ACCOUNT.bank },
  { label: "Account number", value: KANNALI_BANK_ACCOUNT.accountNumber },
  { label: "IFSC", value: KANNALI_BANK_ACCOUNT.ifsc },
];

/** Kannali's account for NEFT, RTGS or IMPS transfers. */
export function BankTransferDetails() {
  return (
    <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-gray-200 bg-white p-3 text-sm sm:grid-cols-2">
      {DETAILS.map(({ label, value }) => (
        <div key={label} className="flex flex-col">
          <dt className="text-xs text-gray-500">{label}</dt>
          <dd className="font-medium break-all text-gray-900 tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
