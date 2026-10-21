/** An application's reference number, set apart so it is easy to read out on the phone. */
export function ReferenceNumber({ value }: { value: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-3 text-center">
      <p className="text-xs text-gray-500">Reference number</p>
      <p className="text-lg font-semibold tracking-wide text-gray-900 tabular-nums">{value}</p>
      <p className="text-xs text-gray-500">Quote this if you call us about your application.</p>
    </div>
  );
}
