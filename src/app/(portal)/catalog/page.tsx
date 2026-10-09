import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/PageHeader";
import { getCatalog, getCatalogFilterOptions, getProduct } from "@/features/catalog/api";
import { CatalogFilters } from "@/features/catalog/components/CatalogFilters";
import { CatalogResults } from "@/features/catalog/components/CatalogResults";
import { CatalogToolbar } from "@/features/catalog/components/CatalogToolbar";
import { parseCatalogParams } from "@/features/catalog/search-params";

export const metadata: Metadata = {
  title: "Catalogue",
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const { filters, view, productId } = parseCatalogParams(await searchParams);
  const [catalog, options, linkedProduct] = await Promise.all([
    getCatalog(filters),
    getCatalogFilterOptions(),
    productId ? getProduct(productId) : null,
  ]);

  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Search by part number or name, filter by the bikes you service, and add to cart."
      />
      <div className="flex gap-6">
        <aside aria-label="Filters" className="hidden w-52 shrink-0 xl:block">
          <CatalogFilters options={options} />
        </aside>
        <div className="@container min-w-0 flex-1">
          <CatalogToolbar options={options} total={catalog.total} view={view} />
          <CatalogResults catalog={catalog} view={view} linkedProduct={linkedProduct} />
        </div>
      </div>
    </>
  );
}
