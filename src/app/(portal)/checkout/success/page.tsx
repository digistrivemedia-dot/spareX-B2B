import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderPlaced } from "@/features/checkout/components/OrderPlaced";
import { getCreditSummary } from "@/features/credit/api";
import { getOrder } from "@/features/orders/api";

export const metadata: Metadata = {
  title: "Order placed",
};

type OrderPlacedPageProps = {
  searchParams: Promise<{ order?: string | string[] }>;
};

export default async function OrderPlacedPage({ searchParams }: OrderPlacedPageProps) {
  const { order: orderId } = await searchParams;
  if (typeof orderId !== "string") notFound();

  const order = await getOrder(orderId);
  if (!order) notFound();
  const credit = order.payment.method === "credit" ? await getCreditSummary() : null;

  return <OrderPlaced order={order} termsDays={credit?.termsDays} />;
}
