"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps } from "react";

import { Input } from "@/components/ui/input";

/** A password input with a show/hide toggle. */
export function PasswordInput(props: Omit<ComponentProps<typeof Input>, "type">) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <div className="relative">
      <Input {...props} type={isVisible ? "text" : "password"} className="pr-10" />
      <button
        type="button"
        onClick={() => setIsVisible((visible) => !visible)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-lg text-gray-500 hover:text-gray-900 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <Icon aria-hidden className="size-4" />
      </button>
    </div>
  );
}
