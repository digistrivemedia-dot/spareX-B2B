import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getProductsById } from "@/features/catalog/api";
import { fitQuantity } from "@/features/quick-order/utils";
import { RequestQuotationForm } from "@/features/quotations/components/RequestQuotationForm";

export const metadata: Metadata = {
  title: "Request quotation",
};

type RequestQuotationPageProps = {
  /** `?items=<productId>:<quantity>,…` from the cart or a quick order. */
  searchParams: Promise<{ items?: string | string[] }>;
};

export default async function RequestQuotationPage({ searchParams }: RequestQuotationPageProps) {
  const { items } = await searchParams;
  const requested = (typeof items === "string" ? items.split(",") : [])
    .map((item) => item.split(":"))
    .map(([productId, quantity]) => ({ productId, quantity: Number(quantity) || null }));
  const products = requested.length
    ? await getProductsById(requested.map((item) => item.productId))
    : [];

  const initialLines = requested.flatMap(({ productId, quantity }) => {
    const product = products.find((candidate) => candidate.id === productId);
    return product
      ? [{ query: product.partNumber, product, ...fitQuantity(product, quantity) }]
      : [];
  });

  return (
    <>
      <PageHeader
        title="Request quotation"
        description="Kannali usually replies with prices within one working day."
      />
      <RequestQuotationForm initialLines={initialLines} />
    </>
  );
}
