"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FrequentlyOrderedItem } from "@/features/catalog/components/FrequentlyOrderedItem";
import type { Product } from "@/features/catalog/types";
import { getStockAtBranch } from "@/features/catalog/utils";
import type { Branch } from "@/features/company/types";
import { useSelectedBranch } from "@/features/company/use-selected-branch";

type FrequentlyOrderedProps = {
  products: Product[];
  branches: Branch[];
};

/** The parts this business reorders most, with stock for the chosen delivery branch. */
export function FrequentlyOrdered({ products, branches }: FrequentlyOrderedProps) {
  const branch = useSelectedBranch(branches);

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <EmptyState
          icon={PackageSearch}
          title="Nothing here yet"
          description="Parts you order often will show up here for quick reordering."
          action={
            <Button variant="outline" asChild>
              <Link href="/catalog">Browse the catalogue</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    // A container, so rows lay out by the list's width rather than the window's.
    <ul className="@container divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white shadow-sm">
      {products.map((product) => (
        <FrequentlyOrderedItem
          key={product.id}
          product={product}
          stock={branch ? getStockAtBranch(product, branch.id) : 0}
        />
      ))}
    </ul>
  );
}
