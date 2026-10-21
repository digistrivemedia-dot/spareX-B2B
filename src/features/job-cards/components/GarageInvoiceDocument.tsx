import type { Branch, Business } from "@/features/company/types";
import type { EstimateLine, GarageInvoice, JobCard } from "@/features/job-cards/types";
import { ESTIMATE_KIND_LABELS } from "@/features/job-cards/utils";
import { formatDate, formatNumber, formatPhone, formatPrice } from "@/lib/format";
import { calculateGst } from "@/lib/gst";

type GarageInvoiceDocumentProps = {
  job: JobCard;
  lines: EstimateLine[];
  /** Absent while previewing, before the invoice is raised. */
  invoice?: GarageInvoice;
  business: Pick<Business, "name" | "gstin">;
  branch?: Branch;
};

/**
 * The garage's tax invoice to its customer, in the garage's name and GSTIN. Garage and customer
 * are both in Karnataka, so GST is split equally into CGST and SGST.
 */
export function GarageInvoiceDocument({
  job,
  lines,
  invoice,
  business,
  branch,
}: GarageInvoiceDocumentProps) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPriceInPaise * line.quantity, 0);
  const gst = lines.reduce(
    (sum, l) => sum + calculateGst(l.unitPriceInPaise * l.quantity, l.gstRatePercent),
    0,
  );

  return (
    <article className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-5 text-sm shadow-sm sm:p-8 print:border-0 print:p-0 print:shadow-none">
      <header className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-lg font-semibold text-gray-900">{business.name}</p>
          {branch && (
            <p className="text-gray-600">
              {[branch.address.line1, branch.address.line2, branch.address.city]
                .filter(Boolean)
                .join(", ")}{" "}
              {branch.address.pin} · {formatPhone(branch.contactPhone)}
            </p>
          )}
          <p className="text-gray-600">
            {business.gstin ? `GSTIN ${business.gstin}` : "Not GST registered"}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-lg font-semibold text-gray-900">
            {invoice ? "Tax invoice" : "Invoice preview"}
          </p>
          {invoice && (
            <p className="text-gray-600">
              {invoice.number} · {formatDate(invoice.issuedAt)}
            </p>
          )}
          <p className="text-gray-600">Job {job.number}</p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs text-gray-500">Billed to</p>
          <p className="font-medium text-gray-900">{job.customer.name}</p>
          <p className="text-gray-600">{formatPhone(job.customer.phone)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Vehicle</p>
          <p className="font-medium text-gray-900">
            {job.vehicle.plate} · {job.vehicle.make} {job.vehicle.model}
          </p>
          {job.checkIn && (
            <p className="text-gray-600">{formatNumber(job.checkIn.odometerKm)} km at check-in</p>
          )}
        </div>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full min-w-120 text-left">
          {/* min-w keeps the columns readable; the table scrolls inside its box on small phones. */}
          <thead className="border-b border-gray-200 text-xs text-gray-500">
            <tr>
              <th className="py-2 font-medium">Item</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Rate</th>
              <th className="py-2 text-right font-medium">GST</th>
              <th className="py-2 text-right font-medium">Taxable value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="py-2">
                  <span className="block text-gray-900">{line.description}</span>
                  <span className="text-xs text-gray-500">
                    {ESTIMATE_KIND_LABELS[line.kind]}
                    {line.partNumber && ` · ${line.partNumber}`}
                  </span>
                </td>
                <td className="py-2 text-right tabular-nums">{line.quantity}</td>
                <td className="py-2 text-right tabular-nums">
                  {formatPrice(line.unitPriceInPaise)}
                </td>
                <td className="py-2 text-right tabular-nums">{line.gstRatePercent}%</td>
                <td className="py-2 text-right font-medium tabular-nums">
                  {formatPrice(line.unitPriceInPaise * line.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto flex w-full max-w-xs flex-col gap-1">
        <Row label="Taxable value" value={formatPrice(subtotal)} />
        <Row label="CGST" value={formatPrice(Math.round(gst / 2))} />
        <Row label="SGST" value={formatPrice(gst - Math.round(gst / 2))} />
        <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatPrice(subtotal + gst)}</dd>
        </div>
      </dl>
      <p className="text-xs text-gray-500">Sample invoice for the demo.</p>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium text-gray-900 tabular-nums">{value}</dd>
    </div>
  );
}
