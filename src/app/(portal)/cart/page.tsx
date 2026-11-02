import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { requirePermission } from "@/features/auth/session";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
};

export default async function CartPage() {
  await requirePermission("orders:place");
  return (
    <>
      <PageHeader
        title="Cart"
        description="Prices are your business prices, excl. GST. Stock is for your delivery branch."
      />
      <CartView />
    </>
  );
}
