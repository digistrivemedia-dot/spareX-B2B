import { cva } from "class-variance-authority";

const wordmarkVariants = cva("text-base leading-tight font-semibold whitespace-nowrap", {
  variants: {
    background: {
      dark: "text-white",
      light: "text-navy-900",
    },
  },
});

const taglineVariants = cva("text-xs whitespace-nowrap", {
  variants: {
    background: {
      dark: "text-navy-200",
      light: "text-gray-500",
    },
  },
});

type LogoProps = {
  /** The colour of what the logo sits on. */
  background: "dark" | "light";
};

/** Text wordmark until the client sends the real logo; swapping it in only changes this file. */
export function Logo({ background }: LogoProps) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden
        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-orange-700 text-sm font-bold text-white"
      >
        SX
      </span>
      <span className="flex flex-col">
        <span className={wordmarkVariants({ background })}>SpareX Business</span>
        <span className={taglineVariants({ background })}>by Kannali Garage</span>
      </span>
    </span>
  );
}
