import { BadgeIndianRupee, Truck, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/layout/Logo";
import { Card, CardContent } from "@/components/ui/card";

// "30‑day" uses a non-breaking hyphen so the line never wraps between "30-" and "day".
const BENEFITS = [
  { icon: BadgeIndianRupee, text: "Business prices on every part, quotations and credit" },
  { icon: Zap, text: "Quick order by part number, reorder in one click" },
  { icon: Truck, text: "GST invoices and delivery to every branch" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh bg-gray-50">
      <aside className="hidden w-96 shrink-0 flex-col justify-between bg-navy-900 p-10 lg:flex">
        <Logo background="dark" />
        <div className="flex flex-col gap-6">
          <p className="text-2xl leading-snug font-semibold text-white">
            Vehicle spare parts for your business, at business prices.
          </p>
          <ul className="flex flex-col gap-4">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-navy-200">
                <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-500" />
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-navy-200">Kannali Garage · Bengaluru</p>
      </aside>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-10">
        <div className="lg:hidden">
          <Logo background="light" />
        </div>
        <Card className="w-full max-w-md">
          <CardContent>{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}
