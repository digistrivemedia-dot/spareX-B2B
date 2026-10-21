/** A vehicle number plate, drawn like the real thing so it is easy to spot in lists. */
export function NumberPlate({ plate }: { plate: string }) {
  return (
    <span className="inline-flex items-center rounded border border-gray-900 bg-white px-1.5 py-0.5 font-mono text-xs font-semibold tracking-wide whitespace-nowrap text-gray-900 uppercase">
      {plate}
    </span>
  );
}
