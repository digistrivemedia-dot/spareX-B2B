import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  /** Shows a spinner and blocks double submits while the request runs. */
  isPending: boolean;
};

export function SubmitButton({ isPending, disabled, children, ...props }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled || isPending} aria-busy={isPending} {...props}>
      {isPending && <LoaderCircle aria-hidden className="animate-spin" />}
      {children}
    </Button>
  );
}
