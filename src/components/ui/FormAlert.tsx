import { CircleAlert } from "lucide-react";

type FormAlertProps = {
  message?: string;
};

/** A form-level error (not tied to one field), e.g. "We couldn't sign you in". */
export function FormAlert({ message }: FormAlertProps) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="flex items-start gap-2 rounded-lg bg-danger-50 p-3 text-sm text-danger-700"
    >
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      {message}
    </p>
  );
}
