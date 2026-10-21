import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/layout/PageHeader";
import { getBranches } from "@/features/company/api";
import { getOrder } from "@/features/orders/api";
import { OrderDetail } from "@/features/orders/components/OrderDetail";
import { getReturns } from "@/features/returns/api";
import { formatDateTime } from "@/lib/format";

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: OrderPageProps): Promise<Metadata> {
  const order = await getOrder((await params).id);
  return { title: order ? `Order ${order.number}` : "Order not found" };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const [order, branches, returns] = await Promise.all([
    getOrder(id),
    getBranches(),
    getReturns({ orderId: id }),
  ]);
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={order.number}
        description={`Placed ${formatDateTime(order.placedAt)}${order.poNumber ? ` · ${order.poNumber}` : ""}`}
      />
      <OrderDetail
        order={order}
        branch={branches.find((b) => b.id === order.branch.id)}
        returns={returns.items}
      />
    </>
  );
}
