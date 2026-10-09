"use client";

import { SearchX } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { DataTablePagination } from "@/components/ui/data-table/DataTablePagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { catalogColumns } from "@/features/catalog/components/columns";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductDrawer } from "@/features/catalog/components/ProductDrawer";
import type { CatalogView } from "@/features/catalog/search-params";
import type { Product } from "@/features/catalog/types";
import { useProductDrawer } from "@/features/catalog/use-product-drawer";
import type { Paginated } from "@/lib/types";

type CatalogResultsProps = {
  catalog: Paginated<Product>;
  view: CatalogView;
  /** The product named in the URL when the page was loaded, which may not be on this page. */
  linkedProduct: Product | null;
};

export function CatalogResults({ catalog, view, linkedProduct }: CatalogResultsProps) {
  const { productId, close } = useProductDrawer();
  const { items, ...pagination } = catalog;
  const drawerProduct =
    items.find((product) => product.id === productId) ??
    (linkedProduct?.id === productId ? linkedProduct : null);

  const noResults = (
    <EmptyState
      icon={SearchX}
      title="No parts match"
      description="Try a different part number or name, or clear some filters."
      action={
        <Button variant="outline" asChild>
          <Link href="/catalog">Clear search and filters</Link>
        </Button>
      }
    />
  );

  return (
    <>
      {view === "table" ? (
        <DataTable
          label="Parts"
          columns={catalogColumns}
          data={items}
          pagination={pagination}
          emptyState={noResults}
        />
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white">{noResults}</div>
      ) : (
        <div className="flex flex-col gap-4">
          <ul
            aria-label="Parts"
            className="grid gap-4 @lg:grid-cols-2 @3xl:grid-cols-3 @6xl:grid-cols-4"
          >
            {items.map((product) => (
              <li key={product.id} className="flex">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <DataTablePagination {...pagination} />
        </div>
      )}
      <ProductDrawer product={drawerProduct} onClose={close} />
    </>
  );
}
