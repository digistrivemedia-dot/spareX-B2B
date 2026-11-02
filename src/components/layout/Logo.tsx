import { cva } from "class-variance-authority";

const wordmarkVariants = cva("text-base leading-tight font-semibold whitespace-nowrap", {
  variants: {
    background: {
      dark: "text-white",
      light: "text-navy-900",
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
        KG
      </span>
      <span className={wordmarkVariants({ background })}>Kannali Garage OS</span>
    </span>
  );
}
