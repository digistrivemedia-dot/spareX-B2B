const STEPS = [
  {
    title: "We verify your business",
    detail: "We check your details and shop photos, usually within 1 working day.",
  },
  {
    title: "We set up your account",
    detail: "Our sales team calls to agree your business discount and, if you need it, credit.",
  },
  {
    title: "You start ordering",
    detail: "Your login details arrive by email, and you can order straight away.",
  },
];

/** What happens after an application is sent. */
export function NextSteps() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-gray-900">What happens next</h2>
      <ol className="flex flex-col gap-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-50 text-xs font-semibold text-navy-700">
              {index + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-gray-900">{step.title}</p>
              <p className="text-sm text-gray-500">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
