import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getOrders } from "@/features/orders/api";
import { OrdersTable } from "@/features/orders/components/OrdersTable";
import { OrdersToolbar } from "@/features/orders/components/OrdersToolbar";
import { parseOrderParams } from "@/features/orders/search-params";

export const metadata: Metadata = {
  title: "Orders",
};

type OrdersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const orders = await getOrders(parseOrderParams(await searchParams));

  return (
    <>
      <PageHeader
        title="Orders"
        description="Track deliveries, download GST invoices and reorder in one click."
      />
      <OrdersToolbar />
      <OrdersTable orders={orders} />
    </>
  );
}
