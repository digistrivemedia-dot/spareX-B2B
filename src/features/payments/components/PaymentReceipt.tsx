import { Logo } from "@/components/layout/Logo";
import { Card, CardContent } from "@/components/ui/card";
import type { Business } from "@/features/company/types";
import type { Payment } from "@/features/payments/types";
import { describeMethod, PAYMENT_STATUS_LABELS } from "@/features/payments/utils";
import { formatDateTime, formatPrice } from "@/lib/format";

type PaymentReceiptProps = {
  payment: Payment;
  business: Pick<Business, "name" | "gstin">;
};

/** A printable receipt for one payment. */
export function PaymentReceipt({ payment, business }: PaymentReceiptProps) {
  const details = [
    {
      label: "Received from",
      value: business.gstin ? `${business.name} (GSTIN ${business.gstin})` : business.name,
    },
    { label: "Date", value: formatDateTime(payment.date) },
    { label: "Method", value: describeMethod(payment) },
    { label: "Reference", value: payment.reference ?? "—" },
    { label: "Status", value: PAYMENT_STATUS_LABELS[payment.status] },
  ];

  return (
    <Card className="mx-auto w-full max-w-2xl print:border-0 print:shadow-none">
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <Logo background="light" />
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">Payment receipt</p>
            <p className="text-xs text-gray-500">Kannali Garage, Bengaluru</p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 text-center">
          <p className="text-sm text-gray-500">Amount received</p>
          <p className="text-3xl font-semibold text-gray-900 tabular-nums">
            {formatPrice(payment.amountInPaise)}
          </p>
        </div>

        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {details.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-0.5">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-medium break-words text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>

        <table className="w-full text-sm">
          <caption className="mb-2 text-left font-semibold text-gray-900">Applied to</caption>
          <tbody className="divide-y divide-gray-100 border-y border-gray-200">
            {payment.appliedTo.map((target) => (
              <tr key={target.id}>
                <td className="py-2 text-gray-700">
                  {target.kind === "order" ? "Order" : "Invoice"} {target.number}
                </td>
                <td className="py-2 text-right font-medium text-gray-900 tabular-nums">
                  {formatPrice(target.amountInPaise)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-xs text-gray-500">
          A computer-generated receipt; no signature needed. Sample for the demo.
        </p>
      </CardContent>
    </Card>
  );
}
