import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PrintButton } from "@/components/ui/PrintButton";
import { requireSession } from "@/features/auth/session";
import { getPayment } from "@/features/payments/api";
import { PaymentReceipt } from "@/features/payments/components/PaymentReceipt";
import { hasReceipt } from "@/features/payments/utils";

export const metadata: Metadata = {
  title: "Payment receipt",
};

type ReceiptPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const [{ business }, payment] = await Promise.all([
    requireSession(),
    getPayment((await params).id),
  ]);
  if (!payment || !hasReceipt(payment)) notFound();

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto flex w-full max-w-2xl flex-wrap justify-between gap-2 print:hidden">
        <Button variant="ghost" asChild>
          <Link href="/payments">Back to payments</Link>
        </Button>
        <PrintButton />
      </div>
      <PaymentReceipt payment={payment} business={business} />
    </div>
  );
}
