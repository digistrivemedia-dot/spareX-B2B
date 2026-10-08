import { Button } from "@/components/ui/button";

type ReviewSectionProps = {
  title: string;
  rows: { label: string; value: string }[];
  onEdit: () => void;
};

/** One block of the registration summary, with a way back to the step that filled it in. */
export function ReviewSection({ title, rows, onEdit }: ReviewSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Button type="button" variant="link" size="sm" className="px-0" onClick={onEdit}>
          Edit<span className="sr-only"> {title.toLowerCase()}</span>
        </Button>
      </div>
      <dl className="grid grid-cols-3 gap-x-4 gap-y-2 px-4 py-3 text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="contents">
            <dt className="text-gray-500">{label}</dt>
            <dd className="col-span-2 break-words text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
