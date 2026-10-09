"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * The product drawer is driven by `?product=<id>`. Opening uses the History API directly,
 * so it is instant (no server round trip) yet still a link you can share or open in a new tab.
 */
export function useProductDrawer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(productId: string | null) {
    const params = new URLSearchParams(searchParams);
    if (productId) params.set("product", productId);
    else params.delete("product");
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return {
    productId: searchParams.get("product"),
    hrefFor,
    open: (productId: string) => window.history.pushState(null, "", hrefFor(productId)),
    close: () => window.history.replaceState(null, "", hrefFor(null)),
  };
}
