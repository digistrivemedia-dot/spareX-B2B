import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
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
